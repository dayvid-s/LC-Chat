import { Request, Response } from "express";
import fs from "fs";
import AppError from "../errors/AppError";

import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import { getIO } from "../libs/socket";
import Queue from "../models/Queue";
import User from "../models/User";
import Whatsapp from "../models/Whatsapp";

import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import DeleteWhatsAppMessage from "../services/WbotServices/DeleteWhatsAppMessage";
import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";
import CheckContactNumber from "../services/WbotServices/CheckNumber";
import EditWhatsAppMessage from "../services/WbotServices/EditWhatsAppMessage";

import { logger } from "../utils/logger";
import { MessageData } from "../helpers/SendMessage";
import ForwardMessageService from "../services/ForwardMessageService/ForwardMessageService";

type IndexQuery = {
  pageNumber: string;
  markAsRead: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { pageNumber, markAsRead } = req.query as IndexQuery;
  const { companyId, profile } = req.user;
  const queues: number[] = [];

  if (profile !== "admin") {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Queue, as: "queues" }]
    });
    user.queues.forEach(queue => {
      queues.push(queue.id);
    });
  }

  const { count, messages, ticket, hasMore } = await ListMessagesService({
    pageNumber,
    ticketId,
    companyId,
    queues
  });

  if (ticket.channel === "whatsapp" && markAsRead === "true") {
    SetTicketMessagesAsRead(ticket);
  }

  return res.json({ count, messages, ticket, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { body, quotedMsg }: MessageData = req.body;
  const medias = req.files as Express.Multer.File[];
  const { companyId } = req.user;
  const userId = Number(req.user.id) || null;

  const ticket = await ShowTicketService(ticketId, companyId);
  const { channel } = ticket;
  if (channel === "whatsapp") {
    SetTicketMessagesAsRead(ticket);
  }

  if (medias) {
    if (channel === "whatsapp") {
      const mediaCaptions = req.body.mediaCaptions || [];
      const captions = Array.isArray(mediaCaptions)
        ? mediaCaptions
        : [mediaCaptions];

      await Promise.all(
        medias.map(async (media: Express.Multer.File, i: number) => {
          const caption = captions[i] || "";
          await SendWhatsAppMedia({ media, ticket, body: caption });

          try {
            fs.unlinkSync(media.path);
          } catch (err) {
            console.error(
              `Erro ao remover arquivo ${media.path}:`,
              err.message
            );
          }
        })
      );
    }
  } else if (channel === "whatsapp") {
    await SendWhatsAppMessage({ body, ticket, userId, quotedMsg });
  }

  return res.send();
};

export const edit = async (req: Request, res: Response): Promise<Response> => {
  const { messageId } = req.params;
  const { companyId } = req.user;
  const userId = Number(req.user.id) || null;
  const { body }: MessageData = req.body;

  const { ticketId, message } = await EditWhatsAppMessage({
    messageId,
    companyId,
    userId,
    body
  });

  const io = getIO();
  io.to(ticketId.toString()).emit(`company-${companyId}-appMessage`, {
    action: "update",
    message
  });

  return res.send();
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;
  const { companyId } = req.user;

  const message = await DeleteWhatsAppMessage(messageId);

  const io = getIO();
  io.to(message.ticketId.toString()).emit(`company-${companyId}-appMessage`, {
    action: "update",
    message
  });

  return res.send();
};

export const send = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const messageData: MessageData = req.body;
  const medias = req.files as Express.Multer.File[];

  if (messageData.number === undefined) {
    throw new AppError("ERR_SYNTAX", 400);
  }
  const whatsapp = await Whatsapp.findByPk(whatsappId);

  if (!whatsapp) {
    throw new AppError("ERR_WHATSAPP_NOT_FOUND", 404);
  }

  try {
    let { number } = messageData;
    const { body, linkPreview } = messageData;
    const saveOnTicket = !!messageData.saveOnTicket;

    if (!number.includes("@")) {
      const numberToTest = messageData.number;

      const { companyId } = whatsapp;

      const CheckValidNumber = await CheckContactNumber(
        numberToTest,
        companyId,
        whatsapp
      );
      number = CheckValidNumber.jid.replace(/\D/g, "");
    }

    if (medias) {
      await Promise.all(
        medias.map(async (media: Express.Multer.File) => {
          await req.app.get("queues").messageQueue.add(
            "SendMessage",
            {
              whatsappId,
              data: {
                number,
                body: media.originalname,
                mediaPath: media.path,
                saveOnTicket
              }
            },
            { removeOnComplete: true, attempts: 3 }
          );
        })
      );
    } else {
      req.app.get("queues").messageQueue.add(
        "SendMessage",
        {
          whatsappId,
          data: {
            number,
            body,
            linkPreview,
            saveOnTicket
          }
        },

        { removeOnComplete: false, attempts: 3 }
      );
    }

    return res.send({ mensagem: "Message added to queue" });
  } catch (err) {
    const error = { errType: typeof err, serialized: JSON.stringify(err), err };
    if (err?.message) {
      console.error(error, `MessageController.send: ${err.message}`);
    } else {
      logger.error(
        error,
        "MessageController.send: Failed to put message on queue"
      );
    }
    throw new AppError("ERR_INTERNAL_ERROR", 500);
  }
};

export const forwardMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId, contactIds, listId } = req.body;
  const { companyId } = req.user;

  if (!messageId) {
    throw new AppError("ID da mensagem é obrigatório.", 400);
  }

  if ((!contactIds && !listId) || (contactIds && listId)) {
    throw new AppError(
      "Forneça apenas contatos OU lista de transmissão, não ambos.",
      400
    );
  }

  if (contactIds && (!Array.isArray(contactIds) || contactIds.length === 0)) {
    throw new AppError("Lista de contatos inválida.", 400);
  }

  const queue = req.app.get("queues").messageQueue;

  const response = await ForwardMessageService({
    messageId,
    contactIds,
    listId,
    companyId,
    queue
  });

  return res.status(200).json({
    message: "Encaminhamento iniciado com sucesso.",
    result: response
  });
};
