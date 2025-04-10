import AppError from "../../errors/AppError";
import TransmissionList from "../../models/TransmissionList";

const ShowTransmissionListService = async (
  id: number
): Promise<TransmissionList> => {
  const list = await TransmissionList.findByPk(id, {
    include: ["contacts", "user", "whatsapp"]
  });

  if (!list) {
    throw new AppError("Lista de transmissão não encontrada.");
  }

  return list;
};

export default ShowTransmissionListService;
