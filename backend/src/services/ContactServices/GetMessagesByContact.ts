import { Op } from "sequelize";
import Message from "../../models/Message";
import ShowTicketService from "../TicketServices/ShowTicketService";

interface Request {
  contactId: number;
  companyId: number;
  ticketId: number;
  pageNumber?: string;
}

interface Response {
  records: Message[];
  count: number;
  hasMore: boolean;
}

const GetMessagesByContact = async ({
  contactId,
  companyId,
  ticketId,
  pageNumber = "1"
}: Request): Promise<Response> => {
  const limit = 50;
  const offset = limit * (+pageNumber - 1);

  const ticket = await ShowTicketService(ticketId, companyId);
  const ticketCreation = ticket.createdAt;

  if (Number.isNaN(contactId)) {
    throw new Error("Invalid contactId. It must be a number.");
  }

  const { count, rows: records } = await Message.findAndCountAll({
    where: {
      contactId,
      companyId,
      isDeleted: false,
      createdAt: {
        [Op.lt]: ticketCreation
      },
      remoteJid: {
        [Op.notLike]: "%@g.us"
      }
    },
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });

  const hasMore = count > offset + records.length;

  return {
    records: records.reverse(),
    count,
    hasMore
  };
};

export default GetMessagesByContact;
