import AppError from "../../errors/AppError";
import TransmissionContact from "../../models/TransmissionContact";
import TransmissionList from "../../models/TransmissionList";
import Contact from "../../models/Contact";

interface Request {
  transmissionListId: number;
  contactId: number;
}

const CreateTransmissionContactService = async ({
  transmissionListId,
  contactId
}: Request): Promise<TransmissionContact> => {
  const list = await TransmissionList.findByPk(transmissionListId);
  const contact = await Contact.findByPk(contactId);

  if (!list) throw new AppError("Transmission list not found");
  if (!contact) throw new AppError("Contact not found");

  const transmissionContact = await TransmissionContact.create({
    transmissionListId,
    contactId
  });

  return transmissionContact;
};

export default CreateTransmissionContactService;
