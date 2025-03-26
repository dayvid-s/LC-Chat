import * as Yup from "yup";
import { Request, Response } from "express";
import fs from "fs";
import { parse as csvParser } from "csv";
import { getIO } from "../libs/socket";
import ListContactsService from "../services/ContactServices/ListContactsService";
import CreateContactService from "../services/ContactServices/CreateContactService";
import ShowContactService from "../services/ContactServices/ShowContactService";
import UpdateContactService from "../services/ContactServices/UpdateContactService";
import DeleteContactService from "../services/ContactServices/DeleteContactService";
import GetContactService from "../services/ContactServices/GetContactService";

import CheckContactNumber from "../services/WbotServices/CheckNumber";
import AppError from "../errors/AppError";
import SimpleListService, {
  SearchContactParams
} from "../services/ContactServices/SimpleListService";
import ContactCustomField from "../models/ContactCustomField";

import { logger } from "../utils/logger";
import GetMessagesByContact from "../services/ContactServices/GetMessagesByContact";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

type IndexGetContactQuery = {
  name: string;
  number: string;
};

interface ExtraInfo extends ContactCustomField {
  name: string;
  value: string;
}
interface ContactData {
  name: string;
  number: string;
  salerId: number;
  email?: string;
  isGroup?: boolean;
  extraInfo?: ExtraInfo[];
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;
  const { companyId } = req.user;

  const { contacts, count, hasMore } = await ListContactsService({
    searchParam,
    pageNumber,
    companyId
  });

  return res.json({ contacts, count, hasMore });
};

export const getContact = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, number } = req.body as IndexGetContactQuery;
  const { companyId } = req.user;

  const contact = await GetContactService({
    name,
    number,
    companyId
  });

  return res.status(200).json(contact);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const newContact: ContactData = req.body;
  newContact.number = newContact.number.replace("-", "").replace(" ", "");

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    number: Yup.string()
      .required()
      .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
  });

  try {
    await schema.validate(newContact);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  if (!newContact.isGroup) {
    const validNumber = await CheckContactNumber(newContact.number, companyId);
    const number = validNumber.jid.replace(/\D/g, "");
    newContact.number = number;
  }

  /**
   * Código desabilitado por demora no retorno
   */
  // const profilePicUrl = await GetProfilePicUrl(validNumber.jid, companyId);

  const contact = await CreateContactService({
    ...newContact,
    // profilePicUrl,
    companyId
  });

  const io = getIO();
  io.to(`company-${companyId}-mainchannel`).emit(
    `company-${companyId}-contact`,
    {
      action: "create",
      contact
    }
  );

  return res.status(200).json(contact);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  const contact = await ShowContactService(contactId, companyId);

  return res.status(200).json(contact);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactData: ContactData = req.body;
  const { companyId } = req.user;

  const schema = Yup.object().shape({
    name: Yup.string(),
    number: Yup.string().matches(
      /^\d+$/,
      "Invalid number format. Only numbers is allowed."
    )
  });

  try {
    await schema.validate(contactData);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  if (!contactData.isGroup) {
    const validNumber = await CheckContactNumber(contactData.number, companyId);
    const number = validNumber.jid.replace(/\D/g, "");
    contactData.number = number;
  }

  const { contactId } = req.params;

  const contact = await UpdateContactService({
    contactData,
    contactId,
    companyId
  });

  const io = getIO();
  io.to(`company-${companyId}-mainchannel`).emit(
    `company-${companyId}-contact`,
    {
      action: "update",
      contact
    }
  );

  return res.status(200).json(contact);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  await ShowContactService(contactId, companyId);

  await DeleteContactService(contactId);

  const io = getIO();
  io.to(`company-${companyId}-mainchannel`).emit(
    `company-${companyId}-contact`,
    {
      action: "delete",
      contactId
    }
  );

  return res.status(200).json({ message: "Contact deleted" });
};

export const list = async (req: Request, res: Response): Promise<Response> => {
  const { name } = req.query as unknown as SearchContactParams;
  const { companyId } = req.user;

  const contacts = await SimpleListService({ name, companyId });

  return res.json(contacts);
};

export const importCsv = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.user;
  const { file } = req;

  if (!file) {
    throw new AppError("ERR_NO_FILE", 400);
  }

  const parser = csvParser(
    { delimiter: ",", columns: true },
    async (err, data) => {
      if (err) {
        throw new AppError("ERR_INVALID_CSV", 400);
      }

      data.forEach(async (record: any) => {
        const contact = {
          companyId,
          name: record.name || record.Name,
          number: record.number || record.Number,
          email: record.email || record.Email,
          extraInfo: []
        };

        Object.keys(record).forEach((key: string) => {
          if (
            key !== "name" &&
            key !== "number" &&
            key !== "email" &&
            key !== "Name" &&
            key !== "Number" &&
            key !== "Email" &&
            record[key]
          ) {
            contact.extraInfo.push({
              name: key,
              value: record[key]
            });
          }
        });

        try {
          const newContact = await CreateContactService(contact);
          const io = getIO();
          io.to(`company-${companyId}-mainchannel`).emit(
            `company-${companyId}-contact`,
            {
              action: "update",
              contact: newContact
            }
          );
        } catch (error) {
          logger.error({ contact }, `Error creating contact: ${error.message}`);
        }
      });
    }
  );

  const readable = fs.createReadStream(file.path);

  parser.on("end", () => {
    readable.destroy();
    fs.unlinkSync(file.path);
  });

  readable.pipe(parser);

  return res.status(200).json({ message: "Contacts being imported" });
};

export const listMessages = async (req: Request, res: Response) => {
  try {
    const { contactId, page, companyId, ticketId } = req.query;

    const pageNumber = page || "1";

    const response = await GetMessagesByContact({
      contactId: Number(contactId),
      companyId: Number(companyId),
      ticketId: Number(ticketId),
      pageNumber: String(pageNumber)
    });

    return res.json(response);
  } catch (error) {
    console.error("Error fetching messages: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
