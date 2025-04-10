import TransmissionList from "../../models/TransmissionList";

const ListTransmissionListsService = async (
  companyId: number
): Promise<TransmissionList[]> => {
  const lists = await TransmissionList.findAll({
    where: { companyId },
    include: ["contacts", "user", "whatsapp"]
  });

  return lists;
};

export default ListTransmissionListsService;
