import { Router } from "express";

import announcementRoutes from "./announcementRoutes";
import apiCompanyRoutes from "./api/apiCompanyRoutes";
import apiContactRoutes from "./api/apiContactRoutes";
import apiMessageRoutes from "./api/apiMessageRoutes";
import apiRoutes from "./apiRoutes";
import authRoutes from "./authRoutes";
import campaignRoutes from "./campaignRoutes";
import campaignSettingRoutes from "./campaignSettingRoutes";
import chatBotRoutes from "./chatBotRoutes";
import chatRoutes from "./chatRoutes";
import companyRoutes from "./companyRoutes";
import companySettingsRoutes from "./companySettingsRoutes";
import contactListItemRoutes from "./contactListItemRoutes";
import contactListRoutes from "./contactListRoutes";
import contactRoutes from "./contactRoutes";
import dashboardRoutes from "./dashboardRoutes";
import filesRoutes from "./filesRoutes";
import helpRoutes from "./helpRoutes";
import invoiceRoutes from "./invoicesRoutes";
import messageRoutes from "./messageRoutes";
import planRoutes from "./planRoutes";
import queueIntegrationRoutes from "./queueIntegrationRoutes";
import queueOptionRoutes from "./queueOptionRoutes";
import queueRoutes from "./queueRoutes";
import quickMessageRoutes from "./quickMessageRoutes";
import scheduleRoutes from "./scheduleRoutes";
import settingRoutes from "./settingRoutes";
import subScriptionRoutes from "./subScriptionRoutes";
import tagRoutes from "./tagRoutes";
import ticketNoteRoutes from "./ticketNoteRoutes";
import ticketRoutes from "./ticketRoutes";
import ticketTagRoutes from "./ticketTagRoutes";
import userRoutes from "./userRoutes";
import versionRouter from "./versionRoutes";
import webHookRoutes from "./webHookRoutes";
import whatsappRoutes from "./whatsappRoutes";
import whatsappSessionRoutes from "./whatsappSessionRoutes";

import scheduleMessageRoutes from "./ScheduledMessagesRoutes";
import flowBuilder from "./flowBuilderRoutes";
import flowCampaignRoutes from "./flowCampaignRoutes";
import flowDefaultRoutes from "./flowDefaultRoutes";
import promptRoutes from "./promptRouter";
import salerRoutes from "./salerRoute";
import statisticsRoutes from "./statisticsRoutes";
import webHook from "./webHookRoutes";


const routes = Router();

routes.use(userRoutes);
routes.use("/auth", authRoutes);
routes.use("/api/messages", apiRoutes);
routes.use(settingRoutes);
routes.use(contactRoutes);
routes.use(ticketRoutes);
routes.use(whatsappRoutes);
routes.use(messageRoutes);
routes.use(messageRoutes);
routes.use(whatsappSessionRoutes);
routes.use(queueRoutes);
routes.use(companyRoutes);
routes.use(planRoutes);
routes.use(ticketNoteRoutes);
routes.use(quickMessageRoutes);
routes.use(helpRoutes);
routes.use(dashboardRoutes);
routes.use(scheduleRoutes);
routes.use(tagRoutes);
routes.use(contactListRoutes);
routes.use(contactListItemRoutes);
routes.use(campaignRoutes);
routes.use(campaignSettingRoutes);
routes.use(announcementRoutes);
routes.use(chatRoutes);
routes.use(chatBotRoutes);
routes.use("/webhook", webHookRoutes);
routes.use(subScriptionRoutes);
routes.use(invoiceRoutes);
routes.use(versionRouter);
routes.use(filesRoutes);
routes.use(queueOptionRoutes);
routes.use(queueIntegrationRoutes);
routes.use(ticketTagRoutes);
routes.use(salerRoutes);

routes.use("/api", apiCompanyRoutes);
routes.use("/api", apiContactRoutes);
routes.use("/api", apiMessageRoutes);

routes.use(flowDefaultRoutes);
routes.use(webHook)
routes.use(flowBuilder)
routes.use(flowCampaignRoutes)


routes.use(promptRoutes);
routes.use(statisticsRoutes);
routes.use(companySettingsRoutes);
routes.use(scheduleMessageRoutes);

export default routes;
