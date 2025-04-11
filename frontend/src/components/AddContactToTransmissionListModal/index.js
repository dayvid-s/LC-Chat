import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  FormControl
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const AddContactToTransmissionListModal = ({ open, onClose, contactId, cleanContact, reload }) => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const [selectedList, setSelectedList] = useState({ id: "", name: "" });
  const [transmissionLists, setTransmissionLists] = useState([{ id: "", name: "" }]);

  useEffect(() => {
    const fetchTransmissionLists = async () => {
      try {
        const { data } = await api.get("/transmission-lists", {
          params: { companyId: user.companyId },
        });
        const formatted = data.map(list => ({ id: list.id, name: list.name }));
        setTransmissionLists([{ id: "", name: "" }, ...formatted]);
      } catch (err) {
        toastError(err);
      }
    };

    if (open) fetchTransmissionLists();
  }, [open, user]);

  const handleClose = () => {
    onClose();
    setSelectedList({ id: "", name: "" });
  };

  const handleSubmit = async () => {
    if (!selectedList?.id || !contactId) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await api.post("/transmission-contacts", {
        transmissionListId: selectedList.id,
        contactId
      });

      toast.success("Contato adicionado à lista com sucesso!");

      if (typeof reload === "function") reload();
      if (typeof cleanContact === "function") cleanContact();

      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth scroll="paper">
        <DialogTitle>Escolha a Lista de Transmissão</DialogTitle>
        <Formik
          initialValues={{}}
          validationSchema={Yup.object()}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSubmit();
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.multFieldLine}>
                  <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                      fullWidth
                      value={selectedList}
                      options={transmissionLists}
                      onChange={(e, newValue) => {
                        setSelectedList(newValue || { id: "", name: "" });
                      }}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" placeholder="Lista de transmissão" />
                      )}
                    />
                  </FormControl>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary" disabled={isSubmitting} variant="outlined">
                  {i18n.t("scheduleModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {i18n.t("scheduleModal.buttons.okAdd")}
                  {isSubmitting && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default AddContactToTransmissionListModal;