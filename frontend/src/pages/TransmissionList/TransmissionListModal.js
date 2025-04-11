import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Auth/AuthContext";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";

const TransmissionListModal = ({ open, onClose, list, onSaved }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    if (list) {
      setName(list.name || "");
      setSelectedContacts(list.contacts || []);
    } else {
      setName("");
      setSelectedContacts([]);
    }
  }, [list]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!searchText) return;

      try {
        setLoadingContacts(true);
        const { data } = await api.get("/contacts", {
          params: {
            searchParam: searchText,
            pageNumber: 1,
          },
        });
        setContactOptions(data.contacts);
      } catch (err) {
        console.error("Erro ao buscar contatos", err);
      } finally {
        setLoadingContacts(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchContacts();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleSave = async () => {
    const companyId = localStorage.getItem("companyId");

    const payload = {
      name,
      userId: user.id,
      companyId: Number(companyId),
      contactIds: selectedContacts.map((c) => c.id),
    };

    try {
      if (list?.id) {
        await api.put(`/transmission-lists/${list.id}`, payload);
        toast.success("Lista editada com sucesso.");
      } else {
        await api.post("/transmission-lists", payload);
        toast.success("Lista criada com sucesso.");
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error("Erro ao salvar lista", err);
      toastError("Erro ao salvar lista");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {list?.id ? "Editar Lista de Transmissão" : "Nova Lista de Transmissão"}
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Nome da Lista"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          margin="normal"
        />

        <Autocomplete
          multiple
          options={contactOptions}
          value={selectedContacts}
          getOptionLabel={(option) => `${option.name} (${option.number})`}
          filterSelectedOptions
          onChange={(e, newValue) => setSelectedContacts(newValue)}
          onInputChange={(e, newInputValue) => setSearchText(newInputValue)}
          loading={loadingContacts}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransmissionListModal;