import React, { useEffect, useState } from "react";

import { Avatar, CardHeader } from "@material-ui/core";

import { generateColor } from "../../helpers/colorGenerator";
import { getInitials } from "../../helpers/getInitials";
import { i18n } from "../../translate/i18n";

const TicketInfo = ({ contact, ticket, onClick }) => {
  const { user } = ticket
  const [userName, setUserName] = useState('')
  const [contactName, setContactName] = useState('')

  useEffect(() => {
    if (contact) {
      setContactName(contact.name);
      if (document.body.offsetWidth < 600) {
        if (contact.name.length > 10) {
          const truncadName = contact.name.substring(0, 10) + '...';
          setContactName(truncadName);
        }
      }
    }

    if (user && contact) {
      setUserName(`${i18n.t("messagesList.header.assignedTo")} ${user.name}`);

      if (document.body.offsetWidth < 600) {
        setUserName(`${user.name}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CardHeader
      onClick={onClick}
      style={{ cursor: "pointer" }}
      titleTypographyProps={{ noWrap: true }}
      subheaderTypographyProps={{ noWrap: true }}
      avatar={
        <Avatar
          style={{
            backgroundColor: generateColor(contact?.number),
            color: "white",
            fontWeight: "bold",
          }}
          src={contact.profilePicUrl}
          alt="contact_image"
        >
          {getInitials(contact?.name)}
        </Avatar>
      }
      title={`${contactName} #${ticket.id}`}
      subheader={
        <>
          {ticket.user && `${i18n.t("messagesList.header.assignedTo")} ${ticket.user.name}`}
          {contact?.saler?.id && (
            <>
              {" - Código do Parceiro: "}
              <strong>{contact.saler.id}</strong>
            </>
          )}
        </>
      }
    />
  );

};

export default TicketInfo;
