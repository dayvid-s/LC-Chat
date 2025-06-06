import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { FormControl, FormControlLabel, Switch } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import { AuthContext } from "../../context/Auth/AuthContext";
import { isArray, capitalize } from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
  root: { display: "flex", flexWrap: "wrap" },
  multFieldLine: { display: "flex", "& > *:not(:last-child)": { marginRight: theme.spacing(1) } },
  btnWrapper: { position: "relative" },
  buttonProgress: { color: green[500], position: "absolute", top: "50%", left: "50%", marginTop: -12, marginLeft: -12 },
  formControl: { margin: theme.spacing(1), minWidth: 120 },
  previewContainer: {
    marginTop: 10,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  mediaPreview: {
    maxWidth: '100%',
    maxHeight: 200,
    objectFit: 'contain',
    borderRadius: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
  },
}));

const ScheduleSchema = Yup.object().shape({
  body: Yup.string().min(5, "Mensagem muito curta").required("Obrigatório"),
  contactId: Yup.number().required("Obrigatório"),
  sendAt: Yup.string().required("Obrigatório"),
  saveMessage: Yup.bool()
});

const ScheduleModal = ({ open, onClose, scheduleId, contactId, cleanContact, reload }) => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const initialState = {
    body: "",
    contactId: "",
    sendAt: moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
    sentAt: "",
    saveMessage: false,
    media: null,  // Adicionando campo de imagem
  };

  const initialContact = { id: "", name: "" };

  const [schedule, setSchedule] = useState(initialState);
  const [currentContact, setCurrentContact] = useState(initialContact);
  const [contacts, setContacts] = useState([initialContact]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (contactId && contacts.length) {
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        setCurrentContact(contact);
      }
    }
  }, [contactId, contacts]);

  useEffect(() => {
    const { companyId } = user;
    if (open) {
      try {
        (async () => {
          const { data: contactList } = await api.get('/contacts/list', { params: { companyId: companyId } });
          let customList = contactList.map((c) => ({ id: c.id, name: c.name }));
          if (isArray(customList)) {
            setContacts([{ id: "", name: "" }, ...customList]);
          }
          if (contactId) {
            setSchedule(prevState => {
              return { ...prevState, contactId };
            });
          }

          if (!scheduleId) return;

          const { data } = await api.get(`/schedules/${scheduleId}`);
          setSchedule(prevState => {
            return { ...prevState, ...data, sendAt: moment(data.sendAt).format('YYYY-MM-DDTHH:mm') };
          });
          setCurrentContact(data.contact);
        })();
      } catch (err) {
        toastError(err);
      }
    }
  }, [scheduleId, contactId, open, user]);

  const handleMediaChange = (e, setFieldValue) => {
    const file = e.currentTarget.files[0];
    if (!file) {
      setPreview(null);
      setFieldValue("media", null);
      return;
    }

    setFieldValue("media", file);

    // Criar URL para preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const handleClose = () => {
    onClose();
    setSchedule(initialState);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const handleSaveSchedule = async values => {
    const scheduleData = new FormData();
    scheduleData.append('body', values.body);
    scheduleData.append('sendAt', values.sendAt);
    scheduleData.append('contactId', values.contactId);
    scheduleData.append('companyId', user.companyId);
    scheduleData.append('saveMessage', values.saveMessage);
    if (values.media) {
      scheduleData.append('file', values.media);
    }

    try {
      if (scheduleId) {
        await api.put(`/schedules/${scheduleId}`, scheduleData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post("/schedules", scheduleData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      toast.success(i18n.t("scheduleModal.success"));
      if (typeof reload === 'function') {
        reload();
      }
      if (contactId) {
        if (typeof cleanContact === 'function') {
          cleanContact();
          history.push('/schedules');
        }
      }
    } catch (err) {
      toastError(err);
    }
    setCurrentContact(initialContact);
    setSchedule(initialState);
    handleClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {schedule.status === 'ERRO' ? 'Erro de Envio' : `Mensagem ${capitalize(schedule.status)}`}
        </DialogTitle>
        <Formik
          initialValues={schedule}
          enableReinitialize={true}
          validationSchema={ScheduleSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveSchedule(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values, setFieldValue }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.multFieldLine}>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      fullWidth
                      value={currentContact}
                      options={contacts}
                      onChange={(e, contact) => {
                        const contactId = contact ? contact.id : '';
                        setSchedule({ ...schedule, contactId });
                        setCurrentContact(contact ? contact : initialContact);
                      }}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, value) => value.id === option.id}
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Contato" />}
                    />
                  </FormControl>
                </div>
                <br />
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    rows={9}
                    multiline={true}
                    label={i18n.t("scheduleModal.form.body")}
                    name="body"
                    error={touched.body && Boolean(errors.body)}
                    helperText={touched.body && errors.body}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                </div>
                <br />
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("scheduleModal.form.sendAt")}
                    type="datetime-local"
                    name="sendAt"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={touched.sendAt && Boolean(errors.sendAt)}
                    helperText={touched.sendAt && errors.sendAt}
                    variant="outlined"
                    fullWidth
                  />
                </div>
                <div className={classes.multFieldLine}>
                  <FormControl fullWidth>
                    <input
                      style={{ marginTop: 10 }}
                      type="file"
                      onChange={(e) => handleMediaChange(e, setFieldValue)}
                      accept="image/*,video/*"
                    />
                    {preview && (
                      <div className={classes.previewContainer}>
                        {values.media?.type.startsWith('image/') ? (
                          <>
                            <img
                              src={preview}
                              alt="Preview"
                              className={classes.mediaPreview}
                            />
                            <Button
                              size="small"
                              variant="contained"
                              className={classes.removeButton}
                              onClick={() => {
                                setPreview(null);
                                setFieldValue("media", null);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </>
                        ) : values.media?.type.startsWith('video/') ? (
                          <>
                            <video
                              src={preview}
                              controls
                              className={classes.mediaPreview}
                            />
                            <Button
                              size="small"
                              variant="contained"
                              className={classes.removeButton}
                              onClick={() => {
                                setPreview(null);
                                setFieldValue("media", null);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    )}
                  </FormControl>
                </div>
                <div className={classes.multFieldLine}>
                  <FormControlLabel
                    label={i18n.t("scheduleModal.form.saveMessage")}
                    labelPlacement="end"
                    control={
                      <Switch
                        size="small"
                        checked={values.saveMessage}
                        onChange={() =>
                          setSchedule({ ...values, saveMessage: !values.saveMessage })
                        }
                        name="saveMessage"
                        color="primary"
                      />
                    }
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("scheduleModal.buttons.cancel")}
                </Button>
                {(schedule.sentAt === null || schedule.sentAt === "") && (
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                    variant="contained"
                    className={classes.btnWrapper}
                  >
                    {scheduleId
                      ? `${i18n.t("scheduleModal.buttons.okEdit")}`
                      : `${i18n.t("scheduleModal.buttons.okAdd")}`}
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ScheduleModal;