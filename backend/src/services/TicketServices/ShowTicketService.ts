import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import Queue from "../../models/Queue";
import Saler from "../../models/Saler";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import User from "../../models/User";
import UserSocketSession from "../../models/UserSocketSession";
import Whatsapp from "../../models/Whatsapp";

const ShowTicketService = async (
  id: string | number,
  companyId: number
): Promise<Ticket> => {
  const ticket = await Ticket.findOne({
    where: {
      id
    },
    include: [
      {
        model: Contact,
        as: "contact",
        attributes: [
          "id",
          "name",
          "number",
          "email",
          "profilePicUrl",
          "presence",
          "disableBot"
        ],
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
              "productionInActualMonth",
              "createdAt",
              "updatedAt"
            ]
          },
          "extraInfo"
        ]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
        include: [
          {
            model: UserSocketSession,
            as: "socketSessions",
            where: { active: true },
            required: false
          }
        ]
      },
      {
        model: Queue,
        as: "queue",
        attributes: ["id", "name", "color"]
      },
      {
        model: Whatsapp,
        as: "whatsapp",
        attributes: ["name", "facebookUserToken", "facebookUserId"]
      },
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "name", "color"]
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
