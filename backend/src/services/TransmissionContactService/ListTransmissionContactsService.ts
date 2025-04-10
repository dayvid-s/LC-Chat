import TransmissionContact from "../../models/TransmissionContact";
import Contact from "../../models/Contact";

const ListTransmissionContactsService = async (
  transmissionListId: number
): Promise<TransmissionContact[]> => {
  const contacts = await TransmissionContact.findAll({
    where: { transmissionListId },
    include: [{ model: Contact }]
  });

  return contacts;
};

export default ListTransmissionContactsService;
