import React, { useEffect, useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Group, LocationCity, Person, Star } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from '@material-ui/icons/Create';
import { i18n } from "../../translate/i18n";

import { CardHeader } from "@material-ui/core";
import { generateColor } from "../../helpers/colorGenerator";
import { getInitials } from "../../helpers/getInitials";
import ContactDrawerSkeleton from "../ContactDrawerSkeleton";
import { ContactForm } from "../ContactForm";
import ContactModal from "../ContactModal";
import { ContactNotes } from "../ContactNotes";
import MarkdownWrapper from "../MarkdownWrapper";

const drawerWidth = 320;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    display: "flex",
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  header: {
    display: "flex",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    minHeight: "73px",
    justifyContent: "flex-start",
  },
  content: {
    display: "flex",

    flexDirection: "column",
    padding: "8px 0px 8px 8px",
    height: "100%",
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },

  contactAvatar: {
    margin: 15,
    width: 100,
    height: 100,
  },

  contactHeader: {
    display: "flex",
    padding: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& > *": {
      margin: 4,
    },
  },

  contactDetails: {
    marginTop: 8,
    padding: 8,
    display: "flex",
    flexDirection: "column",
  },
  contactExtraInfo: {
    marginTop: 4,
    padding: 6,
  },
}));

const ContactDrawer = ({ open, handleDrawerClose, contact, ticket, loading }) => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    setOpenForm(false);
  }, [open, contact]);

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        PaperProps={{ style: { position: "absolute" } }}
        BackdropProps={{ style: { position: "absolute" } }}
        ModalProps={{
          container: document.getElementById("drawer-container"),
          style: { position: "absolute" },
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.header}>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
          <Typography style={{ justifySelf: "center" }}>
            {i18n.t("contactDrawer.header")}
          </Typography>
        </div>
        {loading ? (
          <ContactDrawerSkeleton classes={classes} />
        ) : (
          <div className={classes.content}>
            <Paper square variant="outlined" className={classes.contactHeader}>
              <CardHeader
                onClick={() => { }}
                style={{ cursor: "pointer", width: '100%' }}
                titleTypographyProps={{ noWrap: true }}
                subheaderTypographyProps={{ noWrap: true }}
                avatar={<Avatar src={contact.profilePicUrl} alt="contact_image" style={{ width: 60, height: 60, backgroundColor: generateColor(contact?.number), color: "white", fontWeight: "bold" }}>{getInitials(contact?.name)}</Avatar>}
                title={
                  <>
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "220px",
                      }}
                      onClick={() => setOpenForm(true)}>
                      {contact.name}
                      <CreateIcon style={{ fontSize: 16, marginLeft: 5 }} />
                    </Typography>
                  </>
                }
                subheader={
                  <Typography style={{ fontSize: 12 }}>
                    <Link href={`tel:${contact.number}`}>{contact.number}</Link>
                  </Typography>
                }

              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setModalOpen(!openForm)}
                style={{ fontSize: 12 }}
              >
                {i18n.t("contactDrawer.buttons.edit")}
              </Button>
              {(contact.id && openForm) && <ContactForm initialContact={contact} onCancel={() => setOpenForm(false)} />}
            </Paper>

            {contact?.saler?.situation && (
              <Paper
                square
                variant="outlined"
                className={classes.contactDetails}
                style={{
                  background: contact.saler.situation === 'Ativo'
                    ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)'
                    : 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)',
                  color: 'white',
                  padding: '20px',
                  marginBottom: '16px',
                  borderRadius: '4px',
                  boxShadow: contact.saler.situation === 'Ativo'
                    ? '0 3px 5px 2px rgba(76, 175, 80, .3)'
                    : '0 3px 5px 2px rgba(244, 67, 54, .3)'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Typography
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      color: 'white'
                    }}
                  >
                    Parceiro {contact.saler.situation}
                  </Typography>
                  {contact?.saler?.name && (
                    <Typography
                      style={{
                        fontSize: 18,
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px'
                      }}
                    >
                      {contact.saler.name}
                    </Typography>
                  )}
                  {contact?.saler?.id && (
                    <Typography
                      style={{
                        fontSize: 16,
                        color: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}
                    >
                      Código: {contact.saler.id}
                    </Typography>
                  )}
                </div>
              </Paper>
            )}

            {(contact?.saler?.commercialGroup || contact?.saler?.commercialAssistent) && (
              <Paper
                square
                variant="outlined"
                className={classes.contactDetails}
                style={{
                  background: 'linear-gradient(45deg, #673AB7 30%, #9575CD 90%)',
                  color: 'white',
                  padding: '20px',
                  marginBottom: '16px',
                  borderRadius: '4px',
                  boxShadow: '0 3px 5px 2px rgba(103, 58, 183, .3)'
                }}
              >
                {contact?.saler?.commercialGroup && (
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <Group style={{ marginRight: 8 }} />
                    <div>
                      <Typography style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Grupo Comercial
                      </Typography>
                      <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {contact.saler.commercialGroup}
                      </Typography>
                    </div>
                  </div>
                )}

                {contact?.saler?.commercialAssistent && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Person style={{ marginRight: 8 }} />
                    <div>
                      <Typography style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Assistente Comercial
                      </Typography>
                      <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {contact.saler.commercialAssistent}
                      </Typography>
                    </div>
                  </div>
                )}
              </Paper>
            )}

            {(contact?.saler?.city || contact?.saler?.freeBelt) && (
              <Paper
                square
                variant="outlined"
                className={classes.contactDetails}
                style={{
                  background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
                  color: 'white',
                  padding: '20px',
                  marginBottom: '16px',
                  borderRadius: '4px',
                  boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)'
                }}
              >
                {contact?.saler?.city && (
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <LocationCity style={{ marginRight: 8 }} />
                    <div>
                      <Typography style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Cidade
                      </Typography>
                      <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {contact.saler.city}
                      </Typography>
                    </div>
                  </div>
                )}

                {contact?.saler?.freeBelt && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Star style={{ marginRight: 8 }} />
                    <div>
                      <Typography style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Categoria
                      </Typography>
                      <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {contact.saler.freeBelt}
                      </Typography>
                    </div>
                  </div>
                )}
              </Paper>
            )}

            {contact?.saler?.id && (
              <Paper
                square
                variant="outlined"
                className={classes.contactDetails}
                style={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '4px',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Typography
                    style={{
                      fontSize: 16,
                      marginBottom: '8px',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Produção no mês atual
                  </Typography>
                  <Typography
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                    }}
                  >
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(contact.saler.productionInActualMonth || 0)}
                  </Typography>
                </div>
              </Paper>
            )}

            <Paper square variant="outlined" className={classes.contactDetails}>
              <Typography variant="subtitle1" style={{ marginBottom: 10 }}>
                {i18n.t("ticketOptionsMenu.appointmentsModal.title")}
              </Typography>
              <ContactNotes ticket={ticket} />
            </Paper>
            <Paper square variant="outlined" className={classes.contactDetails}>
              <ContactModal
                open={modalOpen}
                onClose={() => {
                  setModalOpen(false)
                  window.location.reload();
                }}
                contactId={contact.id}
              ></ContactModal>
              <Typography variant="subtitle1">
                {i18n.t("contactDrawer.extraInfo")}
              </Typography>
              {contact?.extraInfo?.map(info => (
                <Paper
                  key={info.id}
                  square
                  variant="outlined"
                  className={classes.contactExtraInfo}
                >
                  <InputLabel>{info.name}</InputLabel>


                  <Typography component="div" noWrap style={{ paddingTop: 2 }}>
                    <MarkdownWrapper>{info.value}</MarkdownWrapper>
                  </Typography>
                </Paper>
              ))}
            </Paper>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default ContactDrawer;
