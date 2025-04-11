import AppError from "../../errors/AppError";
import TransmissionList from "../../models/TransmissionList";

interface Request {
  id: number;
  name?: string;
  contactIds?: number[];
}

const UpdateTransmissionListService = async ({
  id,
  name,
  contactIds = []
}: Request): Promise<TransmissionList> => {
  const list = await TransmissionList.findByPk(id);

  if (!list) {
    throw new AppError("Lista de transmissão não encontrada");
  }

  if (name) list.name = name;
  await list.save();

  // @ts-expect-error dont infer
  await list.setContacts(contactIds);

  const updatedList = await TransmissionList.findByPk(id, {
    include: ["whatsapp", "user", "company", "contacts"]
  });

  if (!updatedList) {
    throw new AppError("Erro ao atualizar lista");
  }

  return updatedList;
};

export default UpdateTransmissionListService;
