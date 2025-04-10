import AppError from "../../errors/AppError";
import TransmissionList from "../../models/TransmissionList";

interface Request {
  name: string;
  userId: number;
  whatsappId: number;
  companyId: number;
}

const CreateTransmissionListService = async ({
  name,
  userId,
  whatsappId,
  companyId
}: Request): Promise<TransmissionList> => {
  if (!name || !userId || !whatsappId || !companyId) {
    throw new AppError("Missing required fields");
  }

  const list = await TransmissionList.create({
    name,
    userId,
    whatsappId,
    companyId
  });

  const listWithRelations = await TransmissionList.findByPk(list.id, {
    include: ["whatsapp", "user", "company"]
  });

  if (!listWithRelations) {
    throw new AppError("Erro ao criar lista");
  }

  return listWithRelations;
};

export default CreateTransmissionListService;
