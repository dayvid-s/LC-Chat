import { useContext, useEffect, useState } from "react";
import {
  makeStyles,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText, CircularProgress,
  Button
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { AuthContext } from "../../context/Auth/AuthContext";
import withWidth from "@material-ui/core/withWidth";
import api from "../../services/api";
import TransmissionListModal from "./TransmissionListModal";
import { toast } from 'react-toastify';
import toastError from "../../errors/toastError";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendToTransmissionListModal from "./SendToTransmissionListModal";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  listItem: {
    borderBottom: "1px solid #eee",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
}));

function TransmissionList(props) {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const [listToEdit, setListToEdit] = useState(null);
  const [sendListId, setSendListId] = useState(null);


  const fetchLists = async () => {
    try {
      const companyId = localStorage.getItem("companyId");
      const { data } = await api.get("/transmission-lists", {
        params: { companyId },
      });
      setLists(data);
    } catch (err) {
      console.error("Erro ao buscar listas", err);
      toast.success("Erro ao buscar listas.");
      toastError(err);

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta lista?")) {
      try {
        await api.delete(`/transmission-lists/${id}`);
        setLists((prev) => prev.filter((item) => item.id !== id));
        toast.success("Lista excluida com sucesso.");

      } catch (err) {
        console.error("Erro ao excluir lista", err);
      }
    }
  };

  const handleOpenModal = (list = null) => {
    setListToEdit(list);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchLists();
  }, []);


  const handleRemoveContact = async (listId, contactId) => {
    try {
      await api.delete(`/transmission-contacts/${listId}/${contactId}`);
      toast.success("Contato removido da lista!");
      fetchLists()

      // if (onSaved) onSaved();
    } catch (err) {
      toastError("Erro ao remover contato da lista");
      console.error(err);
    }
  };

  return (
    <>
      <Paper className={classes.container}>
        <div className={classes.header}>
          <Typography variant="h6">Listas de Transmissão</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            Nova Lista
          </Button>
        </div>

        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {lists.map((list) => (
              <Accordion
                key={list.id}
                expanded={selectedListId === list.id}
                onChange={() =>
                  setSelectedListId((prev) => (prev === list.id ? null : list.id))
                }
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1">{list.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Criado por: {list.user?.name || "Desconhecido"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Contatos: {list.contacts?.length ?? 0}
                    </Typography>
                  </div>
                  <div>


                    {list.contacts?.length > 0 ? (

                      <Button

                        variant="outlined"
                        color="primary"
                        onClick={(e) => {
                          setSendListId(list.id)
                          setMessageModalOpen(true)
                          e.stopPropagation();

                        }}
                      >
                        Enviar Mensagem
                      </Button>
                    ) : null
                    }
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(list);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(list.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </AccordionSummary>

                <AccordionDetails>
                  {list.contacts?.length > 0 ? (
                    <List style={{ width: "100%" }} dense>
                      {list.contacts.map((contact) => (
                        <ListItem key={contact.id} className={classes.listItem}>
                          <ListItemText
                            primary={`${contact?.salerId ? `CÓD - ${contact.salerId} - ` : ''}${contact.name}`}
                            secondary={contact.number}
                          />
                          <Button
                            style={{ marginLeft: "auto" }}
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleRemoveContact(list.id, contact.id)}
                          >
                            Excluir contato
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="textSecondary">
                      Nenhum contato nesta lista.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        )}
      </Paper >

      <TransmissionListModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        list={listToEdit}
        onSaved={fetchLists}
      />
      <SendToTransmissionListModal
        open={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        listId={sendListId}
      />
    </>
  );
}

export default withWidth()(TransmissionList);