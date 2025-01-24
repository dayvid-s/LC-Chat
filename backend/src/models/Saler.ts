import {
  Column,
  CreatedAt,
  DataType, Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";

@Table
class Saler extends Model<Saler> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column
  name: string;

  @Column
  cpf: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Desconhecido"
  })
  phoneNumberOne: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Desconhecido"
  })
  phoneNumberTwo: string;

  @Column
  branch: string;

  @Column
  situation: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Desconhecido"
  })
  commercialAssistent: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Desconhecido"
  })
  commercialGroup: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Desconhecido"
  })
  freeBelt: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Desconhecido"
  })
  email: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Desconhecido"
  })
  city: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "Desconhecido"
  })
  birthdate: string;

  @Column({
    type: DataType.BIGINT,
    defaultValue: 0
  })
  productionInMonth: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}
export default Saler;
