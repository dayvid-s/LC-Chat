import { Request, Response } from "express";
import CreateTransmissionListService from "../services/TransmissionListService/CreateTransmissionListService";
import DeleteTransmissionListService from "../services/TransmissionListService/DeleteTransmissionListService";
import ListTransmissionListsService from "../services/TransmissionListService/ListTransmissionListsService";
import ShowTransmissionListService from "../services/TransmissionListService/ShowTransmissionListService";
import UpdateTransmissionListService from "../services/TransmissionListService/UpdateTransmissionListService";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, userId, companyId, contactIds } = req.body;

  const list = await CreateTransmissionListService({
    name,
    userId,
    companyId,
    contactIds
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

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, contactIds } = req.body;

  const updatedList = await UpdateTransmissionListService({
    id: Number(id),
    name,
    contactIds
  });

  return res.status(200).json(updatedList);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  await DeleteTransmissionListService(Number(id));

  return res.status(200).json({ message: "Lista de transmissão excluida" });
};
