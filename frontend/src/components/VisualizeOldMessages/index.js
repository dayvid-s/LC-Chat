
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

export function VisualizeOldMessages({ ticketId, ticket, contact, isGroup, handleOpenMessageOptionsMenu, loading, setLoading }) {

  const [messagesList, setMessagesList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    setMessagesList([])
    setHasMore(true)
    setPageNumber(1)
  }, [contact])

  async function searchForOldMessages(pageNumber) {
    const companyId = localStorage.getItem("companyId");

    setLoading(true);
    try {
      const response = await api.get("/messages-from-contact", {
        params: {
          contactId: ticket.contactId,
          page: pageNumber,
          companyId: companyId,
          ticketId: ticketId
        }
      });

      const messages = response.data.records;
      setHasMore(response.data.hasMore)
      setMessagesList((prevMessages) => [...messages, ...prevMessages]);
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  }

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

      {!loading && hasMore === true &&

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
          Buscar De tickets Anteriores
        </button>
      }

      {messagesList.length > 0 ? renderMessages() : []}



    </>

  )

}