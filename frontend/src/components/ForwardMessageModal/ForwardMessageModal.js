import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, FormControl,
  Avatar,
  Typography,
  CircularProgress
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";
import api from "../../services/api";

const useStyles = makeStyles(theme => ({
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const ForwardMessageModal = ({ open, onClose, messageId }) => {
  const classes = useStyles();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [lists, setLists] = useState([]);
  const { user } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const [contactOptions, setContactOptions] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [selectedOption, setSelectedOption] = useState('contacts');

  const loadLists = async () => {
    try {
      const companyId = localStorage.getItem("companyId");
      const { data } = await api.get("/transmission-lists", {
        params: { companyId },
      });
      setLists(data);
    } catch (err) {
      toastError(err);
    }
  };

  const loadContacts = useCallback(
    debounce(async (searchParam) => {
      if (!searchParam) {
        setContactOptions([]);
        return;
      }

      try {
        setLoadingContacts(true);
        const { data } = await api.get("/contacts", {
          params: {
            searchParam,
            pageNumber: 1,
          },
        });
        setContactOptions(data.contacts || []);
      } catch (err) {
        console.error("Erro ao buscar contatos", err);
      } finally {
        setLoadingContacts(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (open) {
      loadLists();
    }
  }, [open]);

  useEffect(() => {
    loadContacts(searchText);
  }, [searchText, loadContacts]);

  const handleSubmit = async () => {
    try {
      if (selectedList) {
        await api.post(`/messages/forward`, {
          messageId,
          listId: selectedList.id
        });
      } else if (selectedContacts.length > 0) {
        await api.post(`/messages/forward`, {
          messageId,
          contactIds: selectedContacts.map(c => c.id)
        });
      }
      onClose();
      toast.success("Mensagem encaminhada com sucesso!");
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Encaminhar Mensagem</DialogTitle>
      <Formik
        initialValues={{}}
        validationSchema={Yup.object()}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <DialogContent dividers>
              <FormControl component="fieldset" fullWidth style={{ marginBottom: 16 }}>
                <div style={{
                  display: 'flex',
                  gap: 16,
                  marginBottom: 16,
                  justifyContent: 'center'
                }}>
                  <Button
                    variant={selectedOption === 'contacts' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => {
                      setSelectedOption('contacts');
                      setSelectedList(null);
                    }}
                  >
                    👥 Encaminhar para Contatos
                  </Button>
                  <Button
                    variant={selectedOption === 'list' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => {
                      setSelectedOption('list');
                      setSelectedContacts([]);
                    }}
                  >
                    📋 Encaminhar para lista
                  </Button>
                </div>

                {selectedOption === 'contacts' ? (
                  <FormControl fullWidth>
                    <Autocomplete
                      multiple
                      options={contactOptions}
                      value={selectedContacts}
                      getOptionLabel={(option) => {
                        return `${option?.salerId ? `CÓD - ${option.salerId} - ` : ''}${option.name || option.number}`
                      }}
                      filterSelectedOptions
                      onChange={(e, newValue) => setSelectedContacts(newValue)}
                      onInputChange={(e, newInputValue) => setSearchText(newInputValue)}
                      loading={loadingContacts}
                      renderOption={(option) => {
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                            <Avatar
                              src={option.profilePicUrl}
                              style={{ width: 24, height: 24 }}
                            >
                              {!option.profilePicUrl && (option.name?.[0] || option.number?.[0])}
                            </Avatar>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2">
                                {option?.salerId ? `CÓD - ${option.salerId} - ` : ''}{option.name || option.number}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {option.isGroup ? '📱 Grupo' : '👤 Contato'} • {option.number}
                              </Typography>
                            </div>
                          </div>
                        )
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Contatos"
                          placeholder="Digite o nome ou número"
                          margin="normal"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingContacts ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                ) : (
                  <FormControl fullWidth>
                    <Autocomplete
                      options={lists}
                      value={selectedList}
                      getOptionLabel={(option) =>
                        option ? `${option.name}` : ''
                      }
                      onChange={(e, newValue) => setSelectedList(newValue)}
                      renderOption={(option) => (
                        <li >
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 8,
                            width: '100%'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <Typography variant="body1">
                                📋 {option.name}
                              </Typography>
                              <Typography style={{ marginLeft: 20 }} variant="caption" color="textSecondary">
                                Criada por: {option.user?.name || "Desconhecido"}
                              </Typography>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              marginTop: 4
                            }}>
                              <Typography variant="caption" color="textSecondary">
                                {option.contacts?.length || 0} contatos
                              </Typography>
                              {option.contacts?.some(c => c.isGroup) && (
                                <Typography variant="caption" color="textSecondary">
                                  • Inclui grupos
                                </Typography>
                              )}
                            </div>
                          </div>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Lista de Transmissão"
                          placeholder="Selecione uma lista"
                        />
                      )}
                    />
                  </FormControl>
                )}
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={onClose}
                color="secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={
                  isSubmitting ||
                  (selectedOption === 'contacts' && selectedContacts.length === 0) ||
                  (selectedOption === 'list' && !selectedList)
                }
              >
                Encaminhar
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ForwardMessageModal;