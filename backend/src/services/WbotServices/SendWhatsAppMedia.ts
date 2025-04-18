import { WAMessage, AnyMessageContent } from "@whiskeysockets/baileys";
import * as Sentry from "@sentry/node";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import mime from "mime-types";
import iconv from "iconv-lite";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Ticket from "../../models/Ticket";
import { verifyMediaMessage } from "./wbotMessageListener";

interface Request {
  media: Express.Multer.File;
  ticket: Ticket;
  body?: string;
}

const publicFolder = __dirname.endsWith("/dist")
  ? path.resolve(__dirname, "..", "public")
  : path.resolve(__dirname, "..", "..", "..", "public");

const processAudio = async (audio: string): Promise<string> => {
  const outputAudio = `${publicFolder}/${new Date().getTime()}.mp3`;
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath.path} -i ${audio} -vn -ab 128k -ar 44100 -f ipod ${outputAudio} -y`,
      (error, _stdout, _stderr) => {
        if (error) reject(error);
        fs.unlinkSync(audio);
        resolve(outputAudio);
      }
    );
  });
};

const processAudioFile = async (audio: string): Promise<string> => {
  const outputAudio = `${publicFolder}/${new Date().getTime()}.mp3`;
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath.path} -i ${audio} -vn -ar 44100 -ac 2 -b:a 192k ${outputAudio}`,
      (error, _stdout, _stderr) => {
        if (error) reject(error);
        fs.unlinkSync(audio);
        resolve(outputAudio);
      }
    );
  });
};

export const getMessageOptions = async (
  caption: string,
  pathMedia: string,
  mimeType?: string,
  customFileName?: string
): Promise<AnyMessageContent> => {
  mimeType = mimeType || mime.lookup(pathMedia) || "application/octet-stream";
  const typeMessage = mimeType.split("/")[0];
  const fileName = customFileName || path.basename(pathMedia);

  try {
    if (!mimeType) {
      throw new Error("Invalid mimetype");
    }
    let options: AnyMessageContent;

    if (typeMessage === "video") {
      options = {
        video: fs.readFileSync(pathMedia),
        caption,
        fileName
        // gifPlayback: true
      };
    } else if (typeMessage === "audio") {
      const typeAudio = fileName.includes("audio-record-site");

      // Escolha o processador de áudio apropriado com base no tipo
      const convert = typeAudio
        ? await processAudio(pathMedia)
        : await processAudioFile(pathMedia);

      options = {
        audio: fs.readFileSync(convert),
        mimetype: typeAudio ? "audio/mp4" : mimeType,
        ptt: typeAudio // ptt (push to talk) é verdadeiro apenas para gravações
      };
    } else if (typeMessage === "document" || typeMessage === "text") {
      options = {
        document: fs.readFileSync(pathMedia),
        caption,
        fileName,
        mimetype: mimeType
      };
    } else if (typeMessage === "application") {
      options = {
        document: fs.readFileSync(pathMedia),
        caption,
        fileName,
        mimetype: mimeType
      };
    } else {
      options = {
        image: fs.readFileSync(pathMedia),
        caption
      };
    }

    return options;
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
    return null;
  }
};

const SendWhatsAppMedia = async ({
  media,
  ticket,
  body
}: Request): Promise<WAMessage> => {
  try {
    const wbot = await GetTicketWbot(ticket);
    const pathMedia = media.path;

    // Converte o nome do arquivo original para UTF-8
    let originalNameUtf8 = "";
    try {
      originalNameUtf8 = iconv.decode(
        Buffer.from(media.originalname, "binary"),
        "utf8"
      );
    } catch (error) {
      console.error("Error converting filename to UTF-8:", error);
    }

    // Usando a função getMessageOptions para obter as opções de mensagem
    const options = await getMessageOptions(
      body || "", // Caption
      pathMedia, // Caminho do arquivo
      media.mimetype, // MIME type
      originalNameUtf8 // Nome do arquivo convertido para UTF-8
    );

    const sentMessage = await wbot.sendMessage(
      `${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`,
      {
        ...options
      }
    );

    await verifyMediaMessage(sentMessage, ticket, ticket.contact);
    return sentMessage;
  } catch (err) {
    Sentry.captureException(err);
    console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMedia;
