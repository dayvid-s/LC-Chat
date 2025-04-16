import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
  Avatar,
  Typography
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