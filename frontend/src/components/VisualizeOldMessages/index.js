
import { parseISO, format } from "date-fns";
import clsx from "clsx";
import { isSameDay } from "date-fns";
import vCard from "vcard-parser";
import React, { useEffect, useState } from "react";


import {
  Avatar,
  Button, IconButton, Typography
} from "@material-ui/core";

import {
  AccessTime,
  Block,
  Done,
  DoneAll,
  ExpandMore,
  GetApp, Description
} from "@material-ui/icons";

import MarkdownWrapper from "../MarkdownWrapper";
import ModalImageCors from "../ModalImageCors";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { i18n } from "../../translate/i18n";
import { generateColor } from "../../helpers/colorGenerator";
import { getInitials } from "../../helpers/getInitials";

















import { useStyles } from "../MessagesList";

export function VisualizeOldMessages(contact, isGroup, handleOpenMessageOptionsMenu) {
  const [loading, setLoading] = useState(true);
  const [messagesList, setMessagesList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);


  useEffect(() => {
    setMessagesList([])
  }, [contact])

  async function searchForOldMessages(pageNumber) {
    const companyId = localStorage.getItem("companyId");
    // console.log("o id que ta vomndp ", contact.contact.id)

    setLoading(true);
    try {
      const response = await api.get("/messages-from-contact", {
        params: {
          contactId: contact?.contact?.id ? contact?.contact?.id : 1, // Presumo que ticketId seja o contato
          page: pageNumber,
          companyId: companyId
        }
      });

      const messages = response.data.records;
      setMessagesList((prevMessages) => [...messages, ...prevMessages]);
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => { searchForOldMessages(1) }, [])


  // const messagesList = [
  //   {
  //     "mediaUrl": "http://localhost:8090/public/media/1/14/5/wdhqk-1742517435711.ogg",
  //     "thumbnailUrl": null,
  //     "id": "439BF058D5B430CB1E5D43FCF631D585",
  //     "remoteJid": "559885034371@s.whatsapp.net",
  //     "participant": null,
  //     "dataJson": "{\"key\":{\"remoteJid\":\"559885034371@s.whatsapp.net\",\"fromMe\":false,\"id\":\"439BF058D5B430CB1E5D43FCF631D585\"},\"messageTimestamp\":1742517435,\"pushName\":\"Francisca Carneiro\",\"broadcast\":false,\"message\":{\"audioMessage\":{\"url\":\"https://mmg.whatsapp.net/v/t62.7117-24/13155634_693206456468865_5669860962830477063_n.enc?ccb=11-4&oh=01_Q5AaIeok1HxPJrIQnL5ktcN3dIMh3zsG2y7JUSlWLb61vQSQ&oe=68042F42&_nc_sid=5e03e0&mms3=true\",\"mimetype\":\"audio/ogg; codecs=opus\",\"fileSha256\":\"gsUfIXjbc4bnd/8Y2ddMf+sOUizN2FemtGEKAZy/2lE=\",\"fileLength\":\"57268\",\"seconds\":24,\"ptt\":true,\"mediaKey\":\"klJa/mamz3ih29niAxEO6L2AmbIls2tVpBS9svlyPZs=\",\"fileEncSha256\":\"C6vjh5eDgipULzBPF53UWbttqUOgBePge5KB4B6TpNM=\",\"directPath\":\"/v/t62.7117-24/13155634_693206456468865_5669860962830477063_n.enc?ccb=11-4&oh=01_Q5AaIeok1HxPJrIQnL5ktcN3dIMh3zsG2y7JUSlWLb61vQSQ&oe=68042F42&_nc_sid=5e03e0\",\"mediaKeyTimestamp\":\"1742517411\",\"waveform\":\"AERdU10AV1JFQiMAGAZEQE8HASshU1BVJRBQTGFLEFMAK0YiXVQ4TVNMEgEJHUcoUlRUQ1hOXEA+KGERDicISw==\"},\"messageContextInfo\":{\"deviceListMetadata\":{\"recipientKeyHash\":\"eHJ6Wef5dLeB2w==\",\"recipientTimestamp\":\"1742514149\"},\"deviceListMetadataVersion\":2,\"messageSecret\":\"moK85klDSI3cSYYpHZXtzH3Y2vxG1pCwsYGhLaB2A/Y=\"}}}",
  //     "ack": 0,
  //     "read": true,
  //     "fromMe": false,
  //     "channel": "whatsapp",
  //     "body": "Áudio",
  //     "mediaType": "audio",
  //     "isDeleted": false,
  //     "isEdited": false,
  //     "createdAt": "2025-03-21T00:37:15.715Z",
  //     "updatedAt": "2025-03-21T00:39:53.368Z",
  //     "quotedMsgId": null,
  //     "ticketId": 5,
  //     "contactId": 14,
  //     "companyId": 1,
  //     "queueId": 1
  //   },
  //   {
  //     "mediaUrl": "http://localhost:8090/public/media/1/14/5/iDpky-1742517260133.ogg",
  //     "thumbnailUrl": null,
  //     "id": "6F9E5DB427976305C3F7F8299556A7B2",
  //     "remoteJid": "559885034371@s.whatsapp.net",
  //     "participant": null,
  //     "dataJson": "{\"key\":{\"remoteJid\":\"559885034371@s.whatsapp.net\",\"fromMe\":false,\"id\":\"6F9E5DB427976305C3F7F8299556A7B2\"},\"messageTimestamp\":1742517259,\"pushName\":\"Francisca Carneiro\",\"broadcast\":false,\"message\":{\"audioMessage\":{\"url\":\"https://mmg.whatsapp.net/v/t62.7117-24/29390442_668734275659938_1145072193117989758_n.enc?ccb=11-4&oh=01_Q5AaIUHE3luwcdgS0EzzsIxZGMQ85xkPvV-LL9s4sLfj5XGT&oe=68041B80&_nc_sid=5e03e0&mms3=true\",\"mimetype\":\"audio/ogg; codecs=opus\",\"fileSha256\":\"v+ZXOYtrmKAOcJA4Wlz0HBtKEBbmDse+/aNuHB2ayoY=\",\"fileLength\":\"10808\",\"seconds\":4,\"ptt\":true,\"mediaKey\":\"F3GA+ep3HNIDhv7vnwHK659Fk1yYGDKya9T+QPX8rm4=\",\"fileEncSha256\":\"9mFt3mF63091oyKRxQoVGMkzejGzpSc52vSixLUX4Y0=\",\"directPath\":\"/v/t62.7117-24/29390442_668734275659938_1145072193117989758_n.enc?ccb=11-4&oh=01_Q5AaIUHE3luwcdgS0EzzsIxZGMQ85xkPvV-LL9s4sLfj5XGT&oe=68041B80&_nc_sid=5e03e0\",\"mediaKeyTimestamp\":\"1742517256\",\"waveform\":\"ABEqNBsAAAAAAAAAAAAGGx8qGxkoLCkuNC8yJiQQEA8nKzYtKh4aLiQfITE4Piw0FR4uODgpMCcvNjg7JCA7OQ==\"},\"messageContextInfo\":{\"deviceListMetadata\":{\"recipientKeyHash\":\"eHJ6Wef5dLeB2w==\",\"recipientTimestamp\":\"1742514149\"},\"deviceListMetadataVersion\":2,\"messageSecret\":\"n0RDPgQF03A72bW+4B9i44WrO3C1CnQyQAuUnBxuYRw=\"}}}",
  //     "ack": 4,
  //     "read": true,
  //     "fromMe": false,
  //     "channel": "whatsapp",
  //     "body": "Áudio",
  //     "mediaType": "audio",
  //     "isDeleted": false,
  //     "isEdited": false,
  //     "createdAt": "2025-03-21T00:34:20.151Z",
  //     "updatedAt": "2025-03-21T00:35:24.378Z",
  //     "quotedMsgId": null,
  //     "ticketId": 5,
  //     "contactId": 14,
  //     "companyId": 1,
  //     "queueId": 1
  //   },
  //   {
  //     "mediaUrl": null,
  //     "thumbnailUrl": null,
  //     "id": "14C46B5A1C67B56259D9AF8474468968",
  //     "remoteJid": "559885034371@s.whatsapp.net",
  //     "participant": null,
  //     "dataJson": "{\"key\":{\"remoteJid\":\"559885034371@s.whatsapp.net\",\"fromMe\":false,\"id\":\"14C46B5A1C67B56259D9AF8474468968\"},\"messageTimestamp\":1741546333,\"pushName\":\"Francisca Carneiro\",\"broadcast\":false,\"message\":{\"conversation\":\".\",\"messageContextInfo\":{\"deviceListMetadata\":{\"recipientKeyHash\":\"U1qfzNK5TCwQvg==\",\"recipientTimestamp\":\"1741529249\"},\"deviceListMetadataVersion\":2,\"messageSecret\":\"PQ448tkP/pEcdMbEo8gDeFkaPArg7y7tSNxDiCtn7SM=\"}}}",
  //     "ack": 0,
  //     "read": true,
  //     "fromMe": false,
  //     "channel": "whatsapp",
  //     "body": ".",
  //     "mediaType": "conversation",
  //     "isDeleted": false,
  //     "isEdited": false,
  //     "createdAt": "2025-03-09T18:52:13.411Z",
  //     "updatedAt": "2025-03-10T01:40:09.342Z",
  //     "quotedMsgId": null,
  //     "ticketId": 5,
  //     "contactId": 14,
  //     "companyId": 1,
  //     "queueId": 1
  //   },
  //   {
  //     "mediaUrl": null,
  //     "thumbnailUrl": null,
  //     "id": "BAFE71CAA2B33D0CE20E9FFDE73453F3",
  //     "remoteJid": "559885034371@s.whatsapp.net",
  //     "participant": null,
  //     "dataJson": "{\"key\":{\"remoteJid\":\"559885034371@s.whatsapp.net\",\"fromMe\":false,\"id\":\"BAFE71CAA2B33D0CE20E9FFDE73453F3\"},\"messageTimestamp\":1741530357,\"pushName\":\"Francisca Carneiro\",\"broadcast\":false,\"message\":{\"conversation\":\"<>\",\"messageContextInfo\":{\"deviceListMetadata\":{\"recipientKeyHash\":\"U1qfzNK5TCwQvg==\",\"recipientTimestamp\":\"1741529249\"},\"deviceListMetadataVersion\":2,\"messageSecret\":\"AS6PIrlrxreJeIbqkHFmTdYmSQAvhxeAVJXQ0egyINk=\"}}}",
  //     "ack": 0,
  //     "read": true,
  //     "fromMe": false,
  //     "channel": "whatsapp",
  //     "body": "<>",
  //     "mediaType": "conversation",
  //     "isDeleted": false,
  //     "isEdited": false,
  //     "createdAt": "2025-03-09T14:25:58.220Z",
  //     "updatedAt": "2025-03-09T14:26:03.263Z",
  //     "quotedMsgId": null,
  //     "ticketId": 5,
  //     "contactId": 14,
  //     "companyId": 1,
  //     "queueId": null
  //   },
  //   {
  //     "mediaUrl": null,
  //     "thumbnailUrl": null,
  //     "id": "82F64905DD9D2E652B2CC0EA1EBEEBDC",
  //     "remoteJid": "559885034371@s.whatsapp.net",
  //     "participant": null,
  //     "dataJson": "{\"key\":{\"remoteJid\":\"559885034371@s.whatsapp.net\",\"fromMe\":false,\"id\":\"82F64905DD9D2E652B2CC0EA1EBEEBDC\"},\"messageTimestamp\":1741530334,\"pushName\":\"Francisca Carneiro\",\"broadcast\":false,\"message\":{\"extendedTextMessage\":{\"text\":\".\",\"previewType\":\"NONE\",\"contextInfo\":{\"entryPointConversionSource\":\"global_search_new_chat\",\"entryPointConversionApp\":\"whatsapp\",\"entryPointConversionDelaySeconds\":3},\"inviteLinkGroupTypeV2\":\"DEFAULT\"},\"messageContextInfo\":{\"deviceListMetadata\":{\"recipientKeyHash\":\"U1qfzNK5TCwQvg==\",\"recipientTimestamp\":\"1741529249\"},\"deviceListMetadataVersion\":2,\"messageSecret\":\"+ajnXq43KYYh3O9n2jOjmfUUD7RoazDRNQykAh0Bs94=\"}}}",
  //     "ack": 0,
  //     "read": true,
  //     "fromMe": false,
  //     "channel": "whatsapp",
  //     "body": ".",
  //     "mediaType": "extendedTextMessage",
  //     "isDeleted": false,
  //     "isEdited": false,
  //     "createdAt": "2025-03-09T14:25:34.571Z",
  //     "updatedAt": "2025-03-09T14:25:42.785Z",
  //     "quotedMsgId": null,
  //     "ticketId": 4,
  //     "contactId": 14,
  //     "companyId": 1,
  //     "queueId": null
  //   }]

  const classes = useStyles();

  const renderMessageAck = (message) => {
    if (message.ack === 0) {
      return <AccessTime fontSize="small" className={classes.ackIcons} />;
    }
    if (message.ack === 1) {
      return <Done fontSize="small" className={classes.ackIcons} />;
    }
    if (message.ack === 2) {
      return <DoneAll fontSize="small" className={classes.ackIcons} />;
    }
    if (message.ack === 3) {
      return <DoneAll fontSize="small" className={classes.ackDoneAllIcon} />;
    }
    if (message.ack === 4) {
      return <DoneAll fontSize="small" className={classes.ackDoneReadIcon} />;
    }
  };

  const renderDailyTimestamps = (message, index) => {
    if (index === 0) {
      return (
        <span
          className={classes.dailyTimestamp}
          key={`timestamp-${message.id}`}
        >
          <div className={classes.dailyTimestampText}>
            {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
          </div>
        </span>
      );
    }
    if (index < messagesList.length - 1) {
      let messageDay = parseISO(messagesList[index].createdAt);
      let previousMessageDay = parseISO(messagesList[index - 1].createdAt);

      if (!isSameDay(messageDay, previousMessageDay)) {
        return (
          <span
            className={classes.dailyTimestamp}
            key={`timestamp-${message.id}`}
          >
            <div className={classes.dailyTimestampText}>
              {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
            </div>
          </span>
        );
      }
    }
    if (index === messagesList.length - 1) {
      return (
        <div
          key={`ref-${message.createdAt}`}
          style={{ float: "left", clear: "both" }}
        />
      );
    }
  };

  const renderMessageDivider = (message, index) => {
    if (index < messagesList.length && index > 0) {
      let messageUser = messagesList[index].fromMe;
      let previousMessageUser = messagesList[index - 1].fromMe;

      if (messageUser !== previousMessageUser) {
        return (
          <span style={{ marginTop: 16 }} key={`divider-${message.id}`}></span>
        );
      }
    }
  };

  const scrollToMessage = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });

      // Add the highlight class
      element.classList.add(classes.messageHighlighted);

      // Remove the highlight class after 2 seconds
      setTimeout(() => {
        element.classList.remove(classes.messageHighlighted);
      }, 2000);
    }
  };

  const getQuotedMessageText = (quotedMsg) => {
    if (quotedMsg.mediaUrl?.endsWith(quotedMsg.body)) {
      return "";
    }

    if (isVCard(quotedMsg.body)) {
      return "🪪";
    }

    return quotedMsg.body;
  }



  const renderQuotedMessage = (message) => {
    const data = JSON.parse(message.quotedMsg.dataJson);

    const thumbnail = data?.message?.imageMessage?.jpegThumbnail;
    const mediaUrl = message.quotedMsg?.mediaUrl;
    const imageUrl = thumbnail ? "data:image/png;base64, " + thumbnail : mediaUrl;
    return (
      <div
        className={clsx(classes.quotedContainerLeft, {
          [classes.quotedContainerRight]: message.fromMe,
        })}
        onClick={() => scrollToMessage(message.quotedMsg.id)}
      >
        <span
          className={clsx(classes.quotedSideColorLeft, {
            [classes.quotedSideColorRight]: message.quotedMsg?.fromMe,
          })}
        ></span>
        <div className={classes.quotedMsg}>
          {!message.quotedMsg?.fromMe && (
            <span className={classes.messageContactName}>
              {message.quotedMsg?.contact?.name}
            </span>
          )}
          <MarkdownWrapper>{getQuotedMessageText(message.quotedMsg)}</MarkdownWrapper>
        </div>
        {imageUrl && (
          <img className={classes.quotedThumbnail} src={imageUrl} />
        )}
      </div>
    );
  };

  const renderLinkPreview = (message) => {
    const data = JSON.parse(message.dataJson);

    const title = data?.message?.extendedTextMessage?.title;
    const description = data?.message?.extendedTextMessage?.description;
    const canonicalUrl = data?.message?.extendedTextMessage?.canonicalUrl;
    const url = canonicalUrl && new URL(
      canonicalUrl,
    );

    if (!title && !description && !url) {
      return (<></>);
    }

    const thumbnail = data?.message?.extendedTextMessage?.jpegThumbnail;
    const imageUrl = thumbnail ? "data:image/png;base64, " + thumbnail : "";
    return (
      <a href={canonicalUrl} className={classes.linkPreviewAnchor} target="_blank" rel="noreferrer">
        <div
          className={clsx(classes.quotedContainerLeft, {
            [classes.quotedContainerRight]: message.fromMe,
          })}
        >
          <div className={classes.quotedMsg}>
            {title &&
              <div className={classes.linkPreviewTitle}>
                {title}
              </div>
            }
            {description &&
              <div className={classes.linkPreviewDescription}>
                {description}
              </div>
            }
            {url?.hostname &&
              <div className={classes.linkPreviewUrl}>
                {url.hostname}
              </div>
            }
          </div>
          {!message.thumbnailUrl && imageUrl && (
            <img className={classes.quotedThumbnail} src={imageUrl} />
          )}
        </div>
      </a>
    );
  };


  const formatVCardN = (n) => {
    return (
      (n[3] ? n[3] + " " : "") +
      (n[1] ? n[1] + " " : "") +
      (n[2] ? n[2] + " " : "") +
      (n[0] ? n[0] + " " : "") +
      (n[4] ? n[4] + " " : "")
    );
  }

  const isVCard = (message) => {
    return message.startsWith('{"ticketzvCard":');
  };

  const stringOrFirstElement = (data) => {
    if (!data) {
      return "";
    }
    if (Array.isArray(data)) {
      return data[0];
    }
    return data;
  };


  const renderVCard = (vcardJson) => {
    const cardArray = JSON.parse(vcardJson)?.ticketzvCard;

    if (!cardArray || !Array.isArray(cardArray)) {
      return <div>Invalid VCARD data</div>;
    }

    return cardArray.map((item) => {
      const message = item?.vcard;
      if (!message) {
        return <></>;
      }
      const parsedVCard = vCard.parse(message);
      console.debug("vCard data:", { message, parsedVCard });

      const name = stringOrFirstElement(
        parsedVCard['X-WA-BIZ-NAME']?.[0]?.value ||
        parsedVCard.fn?.[0]?.value ||
        formatVCardN(parsedVCard.n?.[0]?.value));
      const description = stringOrFirstElement(
        parsedVCard['X-WA-BIZ-DESCRIPTION']?.[0]?.value || "");
      const number = stringOrFirstElement(parsedVCard?.tel?.[0]?.value);
      const metaNumber = parsedVCard?.tel?.[0]?.meta?.waid?.[0] || number || "unknown";

      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
            <Avatar style={{ backgroundColor: generateColor(metaNumber), marginRight: 10, marginLeft: 20, width: 60, height: 60, color: "white", fontWeight: "bold" }}>{getInitials(name)}</Avatar>
            <div style={{ width: 350 }}>
              <div>
                <Typography
                  noWrap
                  component="h4"
                  variant="body2"
                  color="textPrimary"
                  style={{ fontWeight: '700' }}
                >
                  {name}
                </Typography>
              </div>

              <div style={{ width: 350 }}>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  style={{ display: 'flex' }}
                >
                  {description}
                </Typography>
              </div>

              <div style={{ width: 350 }}>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  style={{ display: 'flex' }}
                >
                  {number}
                </Typography>
              </div>

            </div>

          </div>
          <div style={{
            width: '100%', display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            borderWidth: '1px 0 0 0',
            borderTopColor: '#bdbdbd',
            borderStyle: 'solid',
            padding: 8
          }}>
            <Typography
              noWrap
              component="h4"
              variant="body2"
              color="textPrimary"
              style={{ fontWeight: '700', color: '#2c9ce7' }}
            >
              Conversar
            </Typography>
          </div>
        </div>
      )

    });
  };

  const messageLocation = (message, createdAt) => {
    return (
      <div className={[classes.textContentItem, { display: 'flex', padding: 5 }]}>
        <img src={message.split('|')[0]} className={classes.imageLocation} />
        <a
          style={{ fontWeight: '700', color: 'gray' }}
          target="_blank"
          href={message.split('|')[1]} rel="noreferrer"> Clique para ver localização</a>
        <span className={classes.timestamp}>
          {format(parseISO(createdAt), "HH:mm")}
        </span>
      </div>
    )
  };


  const checkMessageMedia = (message, data) => {
    const document =
      data?.message?.documentMessage
      || data?.message?.documentWithCaptionMessage?.message?.documentMessage;
    if (!document && message.mediaType === "image") {
      return (
        <>
          {<ModalImageCors imageUrl={message.mediaUrl} isDeleted={message.isDeleted} />}
          <>
            <div className={[clsx({
              [classes.textContentItemDeleted]: message.isDeleted,
              [classes.textContentItem]: !message.isDeleted,
            }),]}>
              {data?.message?.imageMessage?.caption &&
                <>
                  <MarkdownWrapper>
                    {data.message.imageMessage.caption}
                  </MarkdownWrapper>
                </>
              }
            </div>
          </>
        </>
      )
    }
    if (!document && message.mediaType === "audio") {

      return (
        <audio className={classes.audioBottom} controls>
          <source src={message.mediaUrl} type="audio/ogg"></source>
        </audio>
      );
    }

    if (!document || message.mediaType === "video") {
      return (
        <video
          className={classes.messageVideo}
          src={message.mediaUrl}
          controls
        />
      );
    } else {
      return (
        <>
          <div className={classes.downloadMedia}>
            <Button
              startIcon={<Description />}
              endIcon={<GetApp />}
              color="primary"
              variant="outlined"
              target="_blank"
              href={message.mediaUrl.replace(/%/g, '%25')}
            >
              {document?.fileName || message.body}
            </Button>
          </div>
          {message.body !== document?.fileName &&
            <>
              <div className={[clsx({
                [classes.textContentItemDeleted]: message.isDeleted,
              }),]}>
                <MarkdownWrapper>
                  {message.body}
                </MarkdownWrapper>
              </div>
            </>
          }
        </>
      );
    }
  };




  const renderMessages = () => {
    const viewMessagesList = messagesList.map((message, index) => {

      const data = JSON.parse(message.dataJson);
      const isSticker = data?.message && ("stickerMessage" in data.message);
      if (!message.fromMe) {
        return (
          <React.Fragment key={message.id}>
            {renderDailyTimestamps(message, index)}
            {renderMessageDivider(message, index)}

            <div id={message.id}
              className={[clsx(classes.messageContainer, classes.messageLeft, {
                [classes.messageMediaSticker]: isSticker,
              })]}
              title={message.queueId && message.queue?.name}
            >

              <IconButton
                variant="contained"
                size="small"
                id="messageActionsButton"
                disabled={message.isDeleted}
                className={classes.messageActionsButton}
                onClick={(e) => handleOpenMessageOptionsMenu(e, message, data)}
              >
                <ExpandMore />
              </IconButton>
              {isGroup && (
                <span className={classes.messageContactName}>
                  {message.contact?.name}
                </span>
              )}

              {message.thumbnailUrl && (
                <img className={classes.previewThumbnail} src={message.thumbnailUrl} />
              )}

              {message.body.includes('data:image') ? messageLocation(message.body, message.createdAt)
                :
                isVCard(message.body) ?
                  <div
                    className={[clsx(classes.textContentItem, {
                      [classes.textContentItemEdited]: message.isEdited
                    }), { marginRight: 0 }]}>
                    {renderVCard(message.body)}
                  </div>

                  :

                  (<div className={[clsx(classes.textContentItem, {
                    [classes.textContentItemDeleted]: message.isDeleted,
                    [classes.textContentItemEdited]: message.isEdited
                  }),]}>
                    {message.quotedMsg && renderQuotedMessage(message)}
                    {renderLinkPreview(message)}
                    {!isSticker && (
                      message.mediaUrl && !data?.message?.extendedTextMessage ?
                        ""
                        :
                        <>
                          {message.isDeleted && (
                            <Block
                              color="disabled"
                              fontSize="small"
                              className={classes.deletedIcon}
                            />
                          )}
                          <MarkdownWrapper>
                            {message.body}
                          </MarkdownWrapper>
                        </>
                    )
                    }
                    <span className={[clsx(classes.timestamp, {
                      [classes.timestampStickerLeft]: isSticker
                    })]}>
                      {message.isEdited && <span> {i18n.t("message.edited")} </span>}
                      {format(parseISO(message.createdAt), "HH:mm")}
                    </span>
                  </div>)}
              {message.mediaUrl && !data?.message?.extendedTextMessage && checkMessageMedia(message, data)}
            </div>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={message.id}>
            {renderDailyTimestamps(message, index)}
            {renderMessageDivider(message, index)}
            <div id={message.id}
              className={[clsx(classes.messageContainer, classes.messageRight, {
                [classes.messageMediaSticker]: isSticker,
              })]}
              title={message.queueId && message.queue?.name}
            >
              <IconButton
                variant="contained"
                size="small"
                id="messageActionsButton"
                disabled={message.isDeleted}
                className={classes.messageActionsButton}
                onClick={(e) => handleOpenMessageOptionsMenu(e, message, data)}
              >
                <ExpandMore />
              </IconButton>

              {message.thumbnailUrl && (
                <img className={classes.previewThumbnail} src={message.thumbnailUrl} />
              )}

              <div
                className={clsx(classes.textContentItem, {
                  [classes.textContentItemDeleted]: message.isDeleted,
                  [classes.textContentItemEdited]: message.isEdited,
                })}
              >
                {message.isDeleted && (
                  <Block
                    color="disabled"
                    fontSize="small"
                    className={classes.deletedIcon}
                  />
                )}

                {message.body.includes('data:image') ? messageLocation(message.body, message.createdAt)
                  :
                  isVCard(message.body) ?
                    <div className={[classes.textContentItem]}>
                      {renderVCard(message.body)}
                    </div>

                    :
                    message.quotedMsg && renderQuotedMessage(message)}
                {renderLinkPreview(message)}
                {!isSticker && (
                  message.mediaUrl ? "" : <MarkdownWrapper>{message.body}</MarkdownWrapper>
                )
                }
                <span className={[clsx(classes.timestamp, {
                  [classes.timestampStickerRight]: isSticker
                })]}>
                  {message.isEdited && <span> {i18n.t("message.edited")} </span>}
                  {format(parseISO(message.createdAt), "HH:mm")}
                  {renderMessageAck(message)}
                </span>
              </div>
              {message.mediaUrl && checkMessageMedia(message, data)}
            </div>
          </React.Fragment>
        );
      }
    });
    return viewMessagesList;
  };
  return (

    // <div
    //   style={{
    //     overflow: "hidden",
    //     position: "relative",
    //     display: "flex",
    //     flexDirection: "column",
    //     flexGrow: 2,
    //     minWidth: 300,
    //     width: "100%",
    //     minHeight: 2400,
    //     backgroundColor: "red"
    //   }}
    // >
    <>

      <button
        onClick={() => {
          setPageNumber(pageNumber + 1)
          searchForOldMessages(pageNumber)
        }
        }
        style={{
          marginTop: 10,
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          alignSelf: "center",
        }}
      >
        Carregar Mais Mensagens
      </button>

      {messagesList.length > 0 ? renderMessages() : []}



    </>

  )

}