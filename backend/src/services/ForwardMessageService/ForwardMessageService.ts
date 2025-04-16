import path from "path";
import AppError from "../../errors/AppError";
import Message from "../../models/Message";
import Contact from "../../models/Contact";
import TransmissionList from "../../models/TransmissionList";
import TransmissionContact from "../../models/TransmissionContact";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";

interface RequestData {
  messageId: number;
  contactIds?: number[];
  listId?: number;
  companyId: number;
  queue: any;
}

const ForwardMessageService = async ({
  messageId,
  contactIds,
  listId,
  companyId,
  queue
}: RequestData): Promise<any> => {
  const message = await Message.findByPk(messageId);
  if (!message) throw new AppError("Mensagem original não encontrada.", 404);

  const defaultWhatsapp = await GetDefaultWhatsApp(companyId);
  const publicFolder = path.resolve(__dirname, "..", "..", "..", "public");

  let contacts: Contact[] = [];

  if (contactIds?.length) {
    contacts = await Contact.findAll({ where: { id: contactIds } });
  } else if (listId) {
    const list = await TransmissionList.findByPk(listId, {
      include: [{ model: TransmissionContact, include: [Contact] }]
    });
    if (!list) throw new AppError("Lista de transmissão não encontrada.", 404);
    contacts = list.transmissionContacts.map(tc => tc.contact);
  }

  try {
    const jobs = contacts.map(async contact => {
      if (!contact || !contact.number) return;

      const jid = contact.isGroup
        ? `${contact.number}@g.us`
        : `${contact.number}@c.us`;

      const dataToSend: any = {
        number: jid,
        body: message.body,
        saveOnTicket: true
      };

      if (message.mediaUrl) {
        dataToSend.mediaPath = message.mediaUrl.replace(
          /^.*\/public\//,
          `${publicFolder}/`
        );
        dataToSend.fileName = `${message.mediaType}.${message.mediaType === "audio" ? "ogg" : "jpg"
          }`;
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

    return {
      message: "Mensagens adicionadas à fila com sucesso."
    };
  } catch (error) {
    console.error("Erro ao enviar mensagens para a fila:", error);
    throw new AppError("Erro interno ao processar o encaminhamento.", 500);
  }
};

export default ForwardMessageService;
