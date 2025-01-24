import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import Contact from "../../models/Contact";
import Queue from "../../models/Queue";
import QueueIntegrations from "../../models/QueueIntegrations";
import Saler from "../../models/Saler";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";

const ShowTicketUUIDService = async (uuid: string,
  companyId: number): Promise<Ticket> => {
  const ticket = await Ticket.findOne({
    where: {
      uuid,
      companyId
    },
    attributes: [
      "id",
      "uuid",
      "queueId",
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
      "isBot"
    ],
    include: [
      {
        model: Contact,
        as: "contact",
        attributes: ["id", "name", "number", "email", "profilePicUrl", "acceptAudioMessage", "active", "disableBot", "urlPicture", "companyId"],
        include: [
          {
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
          }, "extraInfo", "tags",
          {
            association: "wallets",
            attributes: ["id", "name"]
          }]
      },
      {
        model: Queue,
        as: "queue",
        attributes: ["id", "name", "color"]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"]
      },
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "name", "color"]
      },
      {
        model: Whatsapp,
        as: "whatsapp",
        attributes: ["id", "name", "groupAsTicket", "greetingMediaAttachment", "facebookUserToken", "facebookUserId"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "name"]
      },
      {
        model: QueueIntegrations,
        as: "queueIntegration",
        attributes: ["id", "name"]
      }
    ]
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  return ticket;
};

export default ShowTicketUUIDService;
