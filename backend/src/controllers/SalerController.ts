import { Request, Response } from "express";
import { Op } from "sequelize";
import SalerService from "../services/SalerService/SalerService";
import Saler from "../models/Saler";

class SalerController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { salerId } = req.query;

      if (!salerId) {
        return res.status(200).json([]);
      }

      const searchTerm = String(salerId);

      const salers = await Saler.findAll({
        where: {
          id: {
            [Op.and]: [
              {
                [Op.gte]: parseInt(searchTerm, 10)
              },
              {
                [Op.lt]: parseInt(searchTerm, 10) + 1
              }
            ]
          }
        },
        limit: 10,
        order: [["id", "ASC"]]
      });

      return res.status(200).json(salers);
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const saler = await SalerService.getById(Number(id));
      if (!saler) {
        return res.status(404).json({ error: "Saler not found" });
      }
      return res.status(200).json(saler);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const saler = await SalerService.create(req.body);
      return res.status(201).json(saler);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createMany(req: Request, res: Response): Promise<void> {
    try {
      const salers = req.body;
      if (!salers || !Array.isArray(salers)) {
        // @ts-expect-error asdasds
        return res.status(400).json({
          message: "O parâmetro 'salers' é obrigatório e deve ser um array."
        });
      }
      const createdSalers = await SalerService.createMany({ data: salers });
      res.status(201).json({
        message: "Vendedores processados com sucesso.",
        data: createdSalers
      });
    } catch (error: any) {
      console.error("Erro ao criar vendedores:", error.message);
      res.status(500).json({
        message: "Erro interno ao processar os vendedores.",
        error: error.message
      });
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const updatedSaler = await SalerService.update(Number(id), req.body);
      if (!updatedSaler) {
        return res.status(404).json({ error: "Saler not found" });
      }
      return res.status(200).json(updatedSaler);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const deleted = await SalerService.delete(Number(id));
      if (!deleted) {
        return res.status(404).json({ error: "Saler not found" });
      }
      return res.status(200).json({ message: "Saler deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
export default SalerController;
