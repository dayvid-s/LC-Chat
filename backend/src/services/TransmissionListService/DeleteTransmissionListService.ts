import AppError from "../../errors/AppError";
import TransmissionList from "../../models/TransmissionList";

const DeleteTransmissionListService = async (id: number): Promise<void> => {
  const list = await TransmissionList.findByPk(id);

  if (!list) {
    throw new AppError("Lista de transmissão não encontrada.");
  }

  await list.destroy();
};

export default DeleteTransmissionListService;
