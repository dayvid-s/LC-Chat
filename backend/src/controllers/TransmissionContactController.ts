import { Request, Response } from "express";
import CreateTransmissionContactService from "../services/TransmissionContactService/CreateTransmissionContactService";
import DeleteTransmissionContactService from "../services/TransmissionContactService/DeleteTransmissionContactService";
import ListTransmissionContactsService from "../services/TransmissionContactService/ListTransmissionContactsService";

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { transmissionListId, contactId } = req.body;

  const contact = await CreateTransmissionContactService({
    transmissionListId,
    contactId
  });

  return res.status(201).json(contact);
};

export const list = async (req: Request, res: Response): Promise<Response> => {
  const { transmissionListId } = req.params;

  const contacts = await ListTransmissionContactsService(
    Number(transmissionListId)
  );

  return res.status(200).json(contacts);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { transmissionListId, contactId } = req.params;

  await DeleteTransmissionContactService(
    Number(transmissionListId),
    Number(contactId)
  );

  return res.status(200).json({ message: "Contato removido da lista" });
};
