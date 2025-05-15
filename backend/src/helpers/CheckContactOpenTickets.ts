import { Op } from "sequelize";
import AppError from "../errors/AppError";
import Ticket from "../models/Ticket";

const CheckContactOpenTickets = async (
  contactId: number,
  companyId: number
): Promise<void> => {
  const ticket = await Ticket.findOne({
    where: { contactId, companyId, status: { [Op.or]: ["open", "pending"] } }
  });

  console.log("aqui que dava erro, e agora vai funcionar!");
  if (ticket) {
    throw new AppError("ERR_OTHER_OPEN_TICKET");
  }
};

export default CheckContactOpenTickets;
