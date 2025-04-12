import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Default,
  BeforeCreate,
  BelongsToMany,
  AutoIncrement,
  HasMany
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

import User from "./User";
import Whatsapp from "./Whatsapp";
import Company from "./Company";
import TransmissionContact from "./TransmissionContact";
import Contact from "./Contact";

@Table
class TransmissionList extends Model<TransmissionList> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => TransmissionContact, { as: "transmissionContacts" })
  transmissionContacts: TransmissionContact[];

  @BelongsToMany(() => Contact, () => TransmissionContact)
  contacts: Contact[];

  @Default(uuidv4())
  @Column
  uuid: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeCreate
  static setUUID(list: TransmissionList) {
    list.uuid = uuidv4();
  }
}

export default TransmissionList;
