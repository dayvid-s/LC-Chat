
import Saler from "../../models/Saler";

class SalerService {
  static async getAll(): Promise<Saler[]> {
    return Saler.findAll();
  }

  static async getById(id: number): Promise<Saler | null> {
    return Saler.findByPk(id);
  }

  static async create(data: Partial<Saler>): Promise<Saler> {
    return Saler.create(data);
  }



  static async createMany(salers: { data: any[] }): Promise<any[]> {
    const createdSalers = [];
    for (const saler of salers.data) {
      const existingSaler = await Saler.findOne({ where: { id: saler.id } });
      if (existingSaler) {
        await existingSaler.update(saler);
      } else {
        const created = await Saler.create(saler);
        createdSalers.push(created);
      }
    }
    return createdSalers;
  }



  static async update(id: number, data: Partial<Saler>): Promise<[number, Saler[]]> {
    return Saler.update(data, {
      where: { id },
      returning: true
    });
  }

  static async delete(id: number): Promise<boolean> {
    const deletedRows = await Saler.destroy({
      where: { id }
    });
    return deletedRows > 0;
  }
}

export default SalerService;