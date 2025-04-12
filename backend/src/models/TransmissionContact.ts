import {
  Table,
  Column,
  ForeignKey,
  Model,
  CreatedAt,
  UpdatedAt,
  BelongsTo
} from "sequelize-typescript";

import TransmissionList from "./TransmissionList";
import Contact from "./Contact";

@Table
class TransmissionContact extends Model<TransmissionContact> {
  @ForeignKey(() => TransmissionList)
  @Column
  transmissionListId: number;

  @BelongsTo(() => TransmissionList)
  transmissionList: TransmissionList;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @BelongsTo(() => Contact, { as: "contact" })
  contact: Contact;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default TransmissionContact;
