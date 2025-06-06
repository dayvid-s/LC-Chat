import React, { useContext, useEffect, useRef, useState } from "react";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ConfirmationModal from "../ConfirmationModal";
import TransferTicketModalCustom from "../TransferTicketModalCustom";
import toastError from "../../errors/toastError";
import { Can } from "../Can";
import { AuthContext } from "../../context/Auth/AuthContext";

import ScheduleModal from "../ScheduleModal";
import AddContactToTransmissionListModal from "../AddContactToTransmissionListModal";

const TicketOptionsMenu = ({ ticket, menuOpen, handleClose, anchorEl, showTabGroups }) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [transferTicketModalOpen, setTransferTicketModalOpen] = useState(false);
  const isMounted = useRef(true);
  const { user } = useContext(AuthContext);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [transmissionListModalOpen, setTransmissionListModalOpen] = useState(false);

  const [contactId, setContactId] = useState(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleDeleteTicket = async () => {
    try {
      await api.delete(`/tickets/${ticket.id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenConfirmationModal = e => {
    setConfirmationOpen(true);
    handleClose();
  };

  const handleOpenTransferModal = e => {
    setTransferTicketModalOpen(true);
    handleClose();
  };


  const handleCloseTransferTicketModal = () => {
    if (isMounted.current) {
      setTransferTicketModalOpen(false);
    }
  };

  const handleOpenScheduleModal = () => {
    handleClose();
    setContactId(ticket.contact.id);
    setScheduleModalOpen(true);
  }

  const handleCloseScheduleModal = () => {
    setScheduleModalOpen(false);
    setContactId(null);
  }


  const handleOpenTransmissionListModal = () => {
    handleClose();
    setContactId(ticket.contact.id);
    setTransmissionListModalOpen(true);
  }

  const handleCloseTransmissionListModal = () => {
    setTransmissionListModalOpen(false);
    setContactId(null);
  }


  return (
    <>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={menuOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenScheduleModal}>
          {i18n.t("ticketOptionsMenu.schedule")}
        </MenuItem>
        {(!ticket.isGroup || !showTabGroups || user.profile === "admin") &&
          <MenuItem onClick={handleOpenTransferModal}>
            {i18n.t("ticketOptionsMenu.transfer")}
          </MenuItem>
        }
        <Can
          role={user.profile}
          perform="ticket-options:deleteTicket"
          yes={() => (
            <MenuItem onClick={handleOpenConfirmationModal}>
              {i18n.t("ticketOptionsMenu.delete")}
            </MenuItem>
          )}
        />
        {/* <Can
          role={user.profile}
          perform="ticket-options:deleteTicket"
          yes={() => ( */}
        <MenuItem onClick={handleOpenTransmissionListModal}>
          Adicionar em lista
        </MenuItem>
        {/* )} */}
        {/* /> */}
      </Menu>
      <ConfirmationModal
        title={`${i18n.t("ticketOptionsMenu.confirmationModal.title")} #${ticket.id
          } ${ticket.contact.name
          }?`}
        open={confirmationOpen}
        onClose={setConfirmationOpen}
        onConfirm={handleDeleteTicket}
      >
        {i18n.t("ticketOptionsMenu.confirmationModal.message")}
      </ConfirmationModal>
      <TransferTicketModalCustom
        modalOpen={transferTicketModalOpen}
        onClose={handleCloseTransferTicketModal}
        ticketid={ticket.id}
      />
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        aria-labelledby="form-dialog-title"
        contactId={contactId}
      />
      <AddContactToTransmissionListModal
        open={transmissionListModalOpen}
        onClose={handleCloseTransmissionListModal}
        aria-labelledby="form-dialog-title"
        contactId={contactId}
      />

    </>
  );
};

export default TicketOptionsMenu;