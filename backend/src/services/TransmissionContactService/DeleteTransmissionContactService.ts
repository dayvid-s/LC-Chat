import AppError from "../../errors/AppError";
import TransmissionContact from "../../models/TransmissionContact";

const DeleteTransmissionContactService = async (
  transmissionListId: number,
  contactId: number
): Promise<void> => {
  const contact = await TransmissionContact.findOne({
    where: { transmissionListId, contactId }
  });

  if (!contact) {
    throw new AppError("Contato não encontrado na lista de transmissão", 404);
  }

  await contact.destroy();
};

export default DeleteTransmissionContactService;
