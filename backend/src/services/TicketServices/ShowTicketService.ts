import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import Contact from "../../models/Contact";
import Plan from "../../models/Plan";
import Queue from "../../models/Queue";
import QueueIntegrations from "../../models/QueueIntegrations";
import Saler from "../../models/Saler";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import TicketTag from "../../models/TicketTag";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";

const ShowTicketService = async (
  id: string | number,
  companyId: number
): Promise<Ticket> => {
  const ticket = await Ticket.findOne({
    where: {
      id,
      companyId
    },
    attributes: [
      "id",
      "uuid",
      "queueId",
      "lastFlowId",
      "flowStopped",
      "dataWebhook",
      "flowWebhook",
      "isGroup",
      "channel",
      "status",
      "contactId",
      "useIntegration",
      "lastMessage",
      "updatedAt",
      "unreadMessages",
      "companyId",
      "whatsappId",
      "imported",
      "lgpdAcceptedAt",
      "amountUsedBotQueues",
      "useIntegration",
      "integrationId",
      "userId",
      "amountUsedBotQueuesNPS",
      "lgpdSendMessageAt",
      "isBot",
      "typebotSessionId",
      "typebotStatus",
      "sendInactiveMessage",
      "queueId",
      "fromMe",
      "isOutOfHour",
      "isActiveDemand",
      "typebotSessionTime"
    ],
    include: [
      {
        model: Contact,
        as: "contact",
        attributes: ["id", "companyId", "name", "number", "email", "profilePicUrl", "acceptAudioMessage", "active", "disableBot", "remoteJid", "urlPicture", "lgpdAcceptedAt"],
        include: [{
          model: Saler,
          as: "saler",
          attributes: [
            "id",
            "name",
            "cpf",
            "branch",
            "phoneNumberOne",
            "phoneNumberTwo",
            "situation",
            "commercialAssistent",
            "commercialGroup",
            "freeBelt",
            "email",
            "city",
            "birthdate",
            "productionInMonth",
            "createdAt",
            "updatedAt"
          ]
        }, , "extraInfo", "tags",
        {
          association: "wallets",
          attributes: ["id", "name"]
        }]
      },
      {
        model: Queue,
        as: "queue",
        attributes: ["id", "name", "color"],
        include: ["chatbots"]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "name", "color"]
      },
      {
        model: Whatsapp,
        as: "whatsapp",
        attributes: ["id", "name", "groupAsTicket", "greetingMediaAttachment", "facebookUserToken", "facebookUserId", "status"]

      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "name"],
        include: [{
          model: Plan,
          as: "plan",
          attributes: ["id", "name", "useKanban"]
        }]
      },
      {
        model: QueueIntegrations,
        as: "queueIntegration",
        attributes: ["id", "name"]
      },
      {
        model: TicketTag,
        as: "ticketTags",
        attributes: ["tagId"]
      }
    ]
  });

  if (ticket?.companyId !== companyId) {
    throw new AppError("Não é possível consultar registros de outra empresa");
  }

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  return ticket;
};

export default ShowTicketService;