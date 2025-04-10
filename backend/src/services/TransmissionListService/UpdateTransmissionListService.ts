import AppError from "../../errors/AppError";
import TransmissionList from "../../models/TransmissionList";

interface Request {
  id: number;
  name?: string;
  whatsappId?: number;
}

const UpdateTransmissionListService = async ({
  id,
  name,
  whatsappId
}: Request): Promise<TransmissionList> => {
  const list = await TransmissionList.findByPk(id);

  if (!list) {
    throw new AppError("Lista de transmissão não encontrada.");
  }

  if (name) list.name = name;
  if (whatsappId) list.whatsappId = whatsappId;

  await list.save();

  return list;
};

export default UpdateTransmissionListService;
