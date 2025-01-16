import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import Queue from "../../models/Queue";
import Saler from "../../models/Saler";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";

const ShowTicketService = async (
  id: string | number,
  companyId: number
): Promise<Ticket> => {
  const ticket = await Ticket.findByPk(id, {
    include: [
      {
        model: Contact,
        as: "contact",
        attributes: ["id", "name", "number", "email", "profilePicUrl"],
        include: [
          {
            model: Saler,
            as: "saler",
            attributes: [
              "id",
              "name",
              "cpf",
              "branch",
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
          },
          "extraInfo"
        ],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"]
      },
      {
        model: Queue,
        as: "queue",
        attributes: ["id", "name", "color"],
        include: ["prompt", "queueIntegrations"]
      },
      {
        model: Whatsapp,
        as: "whatsapp",
        attributes: ["name"]
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
