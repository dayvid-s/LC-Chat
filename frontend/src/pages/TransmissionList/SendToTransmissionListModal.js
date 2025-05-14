import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { Close, CloudUpload } from "@material-ui/icons";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { toast } from "react-toastify";

const SendToTransmissionListModal = ({
  open,
  onClose,
  listId
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveOnTicket, setSaveOnTicket] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!file && !text.trim()) return;

    const formData = new FormData();
    formData.append("body", text);
    formData.append("saveOnTicket", String(saveOnTicket));

    if (file) formData.append("media", file);

    setLoading(true);
    try {
      await api.post(
        `/transmission-lists/${listId}/send-media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      toast.success("Mensagens enviadas com sucesso");

      onClose();
      setText("");
      setFile(null);
      setPreview(null);
      setSaveOnTicket(false);
    } catch (err) {
      console.error("Erro ao enviar:", err);
      toastError("Erro ao enviar mensagem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Enviar mensagem para a lista
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Mensagem"
          multiline
          fullWidth
          rows={4}
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={saveOnTicket}
              onChange={(e) => setSaveOnTicket(e.target.checked)}
              color="primary"
            />
          }
          label="Salvar mensagens no ticket"
        />
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          fullWidth
          style={{ marginTop: 16 }}
        >
          Selecionar imagem ou vídeo
          <input type="file" hidden accept="image/*,video/*" onChange={handleFileChange} />
        </Button>

        {preview && (
          <Box mt={2}>
            {file?.type.startsWith("video/") ? (
              <video src={preview} controls width="100%" style={{ borderRadius: 8 }} />
            ) : (
              <img src={preview} alt="preview" width="100%" style={{ borderRadius: 8 }} />
            )}
            <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: 8 }}>
              {file?.name}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {loading ? <CircularProgress size={24} /> : "Enviar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendToTransmissionListModal;