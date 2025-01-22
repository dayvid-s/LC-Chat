import { Sequelize } from "sequelize-typescript";
import Announcement from "../models/Announcement";
import ApiUsages from "../models/ApiUsages";
import Baileys from "../models/Baileys";
import Campaign from "../models/Campaign";
import CampaignSetting from "../models/CampaignSetting";
import CampaignShipping from "../models/CampaignShipping";
import Chat from "../models/Chat";
import ChatMessage from "../models/ChatMessage";
import ChatUser from "../models/ChatUser";
import Chatbot from "../models/Chatbot";
import CompaniesSettings from "../models/CompaniesSettings";
import Company from "../models/Company";
import Contact from "../models/Contact";
import ContactCustomField from "../models/ContactCustomField";
import ContactList from "../models/ContactList";
import ContactListItem from "../models/ContactListItem";
import ContactTag from "../models/ContactTag";
import ContactWallet from "../models/ContactWallet";
import DialogChatBots from "../models/DialogChatBots";
import Files from "../models/Files";
import FilesOptions from "../models/FilesOptions";
import Help from "../models/Help";
import Invoices from "../models/Invoices";
import LogTicket from "../models/LogTicket";
import Message from "../models/Message";
import Partner from "../models/Partner";
import Plan from "../models/Plan";
import Prompt from "../models/Prompt";
import Queue from "../models/Queue";
import QueueIntegrations from "../models/QueueIntegrations";
import QuickMessage from "../models/QuickMessage";
import Saler from "../models/Saler";
import Schedule from "../models/Schedule";
import ScheduledMessages from "../models/ScheduledMessages";
import ScheduledMessagesEnvio from "../models/ScheduledMessagesEnvio";
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
import Versions from "../models/Versions";
import Whatsapp from "../models/Whatsapp";
import WhatsappQueue from "../models/WhatsappQueue";

import { FlowAudioModel } from "../models/FlowAudio";
import { FlowBuilderModel } from "../models/FlowBuilder";
import { FlowCampaignModel } from "../models/FlowCampaign";
import { FlowDefaultModel } from "../models/FlowDefault";
import { FlowImgModel } from "../models/FlowImg";
import { WebhookModel } from "../models/Webhook";

// eslint-disable-next-line
const dbConfig = require("../config/database");

const sequelize = new Sequelize(dbConfig);

const models = [
  Company,
  User,
  Contact,
  ContactTag,
  Ticket,
  Message,
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
  Schedule,
  Tag,
  TicketTag,
  ContactList,
  ContactListItem,
  Campaign,
  CampaignSetting,
  Baileys,
  CampaignShipping,
  Announcement,
  Chat,
  ChatUser,
  ChatMessage,
  Chatbot,
  DialogChatBots,
  QueueIntegrations,
  Invoices,
  Subscriptions,
  ApiUsages,
  Files,
  FilesOptions,
  CompaniesSettings,
  LogTicket,
  Prompt,
  Partner,
  ContactWallet,
  ScheduledMessages,
  ScheduledMessagesEnvio,
  Versions,
  FlowDefaultModel,
  FlowBuilderModel,
  FlowAudioModel,
  FlowCampaignModel,
  FlowImgModel,
  WebhookModel,
  Saler
];

sequelize.addModels(models);

export default sequelize;
