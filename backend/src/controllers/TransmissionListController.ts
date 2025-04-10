import { Request, Response } from "express";
import CreateTransmissionListService from "../services/TransmissionListService/CreateTransmissionListService";
import DeleteTransmissionListService from "../services/TransmissionListService/DeleteTransmissionListService";
import ListTransmissionListsService from "../services/TransmissionListService/ListTransmissionListsService";
import ShowTransmissionListService from "../services/TransmissionListService/ShowTransmissionListService";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, whatsappId, userId, companyId } = req.body;

  const list = await CreateTransmissionListService({
    name,
    whatsappId,
    userId,
    companyId
  });

  return res.status(201).json(list);
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.query;

  const lists = await ListTransmissionListsService(Number(companyId));

  return res.status(200).json(lists);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const list = await ShowTransmissionListService(Number(id));

  return res.status(200).json(list);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  await DeleteTransmissionListService(Number(id));

  return res.status(200).json({ message: "Lista de transmissão excluida" });
};
