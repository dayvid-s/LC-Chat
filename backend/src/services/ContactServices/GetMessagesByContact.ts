import Message from "../../models/Message";

interface Request {
  contactId: number;
  companyId: number;
  pageNumber?: string;
}

interface Response {
  records: Message[];
  count: number;
  hasMore: boolean;
}

const GetMessagesByContact = async ({
  contactId,
  companyId,
  pageNumber = "1"
}: Request): Promise<Response> => {
  const limit = 2; // Número de mensagens por página
  const offset = limit * (+pageNumber - 1); // Lógica de deslocamento para paginação

  console.log(companyId, "contactsId");
  if (Number.isNaN(contactId)) {
    throw new Error("Invalid contactId. It must be a number.");
  }
  // Realiza a busca das mensagens do contato
  const { count, rows: records } = await Message.findAndCountAll({
    where: {
      contactId,
      companyId,
      isDeleted: false // Considera apenas mensagens não deletadas
    },
    limit, // Limita a quantidade de registros por página
    offset, // Aplica o deslocamento para paginação
    order: [["createdAt", "DESC"]] // Ordena as mensagens por data de criação
  });

  // Verifica se há mais registros para a próxima página
  const hasMore = count > offset + records.length;

  return {
    records: records.reverse(), // Registros das mensagens
    count, // Contagem total de mensagens
    hasMore // Se há mais registros para a próxima página
  };
};

export default GetMessagesByContact;
