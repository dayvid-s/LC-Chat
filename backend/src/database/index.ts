import { Sequelize } from "sequelize-typescript";
import Announcement from "../models/Announcement";
import Baileys from "../models/Baileys";
import BaileysKeys from "../models/BaileysKeys";
import Campaign from "../models/Campaign";
import CampaignSetting from "../models/CampaignSetting";
import CampaignShipping from "../models/CampaignShipping";
import Chat from "../models/Chat";
import ChatMessage from "../models/ChatMessage";
import ChatUser from "../models/ChatUser";
import Company from "../models/Company";
import Contact from "../models/Contact";
import ContactCustomField from "../models/ContactCustomField";
import ContactList from "../models/ContactList";
import ContactListItem from "../models/ContactListItem";
import Help from "../models/Help";
import Invoices from "../models/Invoices";
import Message from "../models/Message";
import OldMessage from "../models/OldMessage";
import Plan from "../models/Plan";
import Queue from "../models/Queue";
import QueueOption from "../models/QueueOption";
import QuickMessage from "../models/QuickMessage";
import Saler from "../models/Saler";
import Schedule from "../models/Schedule";
import Setting from "../models/Setting";
import Subscriptions from "../models/Subscriptions";
import Tag from "../models/Tag";
import Ticket from "../models/Ticket";
import TicketNote from "../models/TicketNote";
import TicketTag from "../models/TicketTag";
import TicketTraking from "../models/TicketTraking";
import User from "../models/User";
import UserQueue from "../models/UserQueue";
import UserRating from "../models/UserRating";
import UserSocketSession from "../models/UserSocketSession";
import Whatsapp from "../models/Whatsapp";
import WhatsappQueue from "../models/WhatsappQueue";
import TransmissionContact from "../models/TransmissionContact";
import TransmissionList from "../models/TransmissionList";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require("../config/database");

const sequelize = new Sequelize(dbConfig);

const models = [
  Company,
  User,
  UserSocketSession,
  Contact,
  Ticket,
  Message,
  OldMessage,
  Whatsapp,
  ContactCustomField,
  Setting,
  Queue,
  WhatsappQueue,
  UserQueue,
  Plan,
  TicketNote,
  QuickMessage,
  Help,
  TicketTraking,
  UserRating,
  QueueOption,
  Schedule,
  Tag,
  TicketTag,
  ContactList,
  ContactListItem,
  Campaign,
  CampaignSetting,
  Baileys,
  BaileysKeys,
  CampaignShipping,
  Announcement,
  Chat,
  ChatUser,
  ChatMessage,
  Invoices,
  Subscriptions,
  Saler,
  TransmissionList,
  TransmissionContact
];

sequelize.addModels(models);

export default sequelize;
