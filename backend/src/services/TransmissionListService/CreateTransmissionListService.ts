import AppError from "../../errors/AppError";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import TransmissionList from "../../models/TransmissionList";

interface Request {
  name: string;
  userId: number;
  companyId: number;
}

interface Request {
  name: string;
  userId: number;
  companyId: number;
  contactIds?: number[];
}

const CreateTransmissionListService = async ({
  name,
  userId,
  companyId,
  contactIds = []
}: Request): Promise<TransmissionList> => {
  if (!name || !userId || !companyId) {
    throw new AppError("Missing required fields");
  }

  const defaultWhatsapp = await GetDefaultWhatsApp(companyId);

  const list = await TransmissionList.create({
    name,
    userId,
    whatsappId: defaultWhatsapp.id,
    companyId
  });

  if (contactIds.length > 0) {
    // @ts-expect-error dont infer
    await list.setContacts(contactIds);
  }

  const listWithRelations = await TransmissionList.findByPk(list.id, {
    include: ["whatsapp", "user", "company", "contacts"]
  });

  if (!listWithRelations) {
    throw new AppError("Erro ao criar lista");
  }

  return listWithRelations;
};

export default CreateTransmissionListService;
