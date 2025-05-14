import { Request, Response } from "express";
import CreateTransmissionListService from "../services/TransmissionListService/CreateTransmissionListService";
import DeleteTransmissionListService from "../services/TransmissionListService/DeleteTransmissionListService";
import ListTransmissionListsService from "../services/TransmissionListService/ListTransmissionListsService";
import ShowTransmissionListService from "../services/TransmissionListService/ShowTransmissionListService";
import UpdateTransmissionListService from "../services/TransmissionListService/UpdateTransmissionListService";
import AppError from "../errors/AppError";
import Contact from "../models/Contact";
import TransmissionContact from "../models/TransmissionContact";
import TransmissionList from "../models/TransmissionList";

import GetDefaultWhatsApp from "../helpers/GetDefaultWhatsApp";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, userId, companyId, contactIds } = req.body;

  const list = await CreateTransmissionListService({
    name,
    userId,
    companyId,
    contactIds
  });

  return res.status(201).json(list);
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.query;

  const lists = await ListTransmissionListsService(Number(companyId));

  return res.status(200).json(lists);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const list = await ShowTransmissionListService(Number(id));

  return res.status(200).json(list);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, contactIds } = req.body;

  const updatedList = await UpdateTransmissionListService({
    id: Number(id),
    name,
    contactIds
  });

  return res.status(200).json(updatedList);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  await DeleteTransmissionListService(Number(id));

  return res.status(200).json({ message: "Lista de transmissão excluida" });
};

export const sendMediaToList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { listId } = req.params;
  const { body, saveOnTicket = false } = req.body;

  const { companyId } = req.user;

  if (!listId || listId === "undefined" || listId === "null") {
    throw new AppError("O ID da lista (listId) é obrigatório.", 400);
  }

  const media = (req.file || req.files?.[0]) as Express.Multer.File | undefined;

  if (!body) {
    throw new AppError("A mensagem (body) é obrigatória.", 400);
  }

  const transmissionList = await TransmissionList.findByPk(listId, {
    include: [
      {
        model: TransmissionContact,
        include: [Contact]
      }
    ]
  });

  if (!transmissionList) {
    throw new AppError("Lista de transmissão não encontrada.", 404);
  }

  let defaultWhatsapp;
  try {
    defaultWhatsapp = await GetDefaultWhatsApp(companyId);
  } catch (err) {
    throw new AppError("Nenhum WhatsApp padrão configurado.", 500);
  }

  const queue = req.app.get("queues").messageQueue;

  try {
    const jobs = transmissionList.transmissionContacts.map(async (tc: any) => {
      const { contact } = tc;
      if (!contact || !contact.number) return;

      const jid = contact.isGroup
        ? `${contact.number}@g.us`
        : `${contact.number}@c.us`;
      const dataToSend: any = {
        number: jid,
        body,
        saveOnTicket: saveOnTicket === "true"
      };

      if (media) {
        dataToSend.mediaPath = media.path;
        dataToSend.fileName = media.originalname;
      }
      await queue.add(
        "SendMessage",
        {
          whatsappId: defaultWhatsapp.id,
          data: dataToSend
        },
        {
          removeOnComplete: true,
          attempts: 3
        }
      );
    });

    await Promise.all(jobs);

    return res.status(200).json({
      message: "Mensagens adicionadas à fila com sucesso."
    });
  } catch (error) {
    console.error("Erro ao enviar mensagens para a fila:", error);
    throw new AppError(
      "Erro interno ao processar a lista de transmissão.",
      500
    );
  }
};
