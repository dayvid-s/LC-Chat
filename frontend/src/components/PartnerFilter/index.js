import { Box, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useState } from "react";
import toastError from "../../errors/toastError";
import api from "../../services/api";

export function PartnerFilter({ onFiltered }) {
  const [salers, setSalers] = useState([]);
  const [selectedSaler, setSelectedSaler] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSalers = async (value) => {
    if (!value || !/^\d+$/.test(value)) {
      setSalers([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`/salers?salerId=${value}`);
      setSalers(data);
    } catch (err) {
      toastError(err);
      setSalers([]);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (value) => {
    setSelectedSaler(value);
    onFiltered(value ? [value] : []);
  };

  return (
    <Box style={{ padding: 10 }}>
      <Autocomplete
        size="small"
        options={salers}
        value={selectedSaler}
        onChange={(e, v) => onChange(v)}
        onInputChange={(e, newValue) => {
          const numbersOnly = newValue.replace(/\D/g, '');
          loadSalers(numbersOnly);
        }}
        loading={loading}
        getOptionSelected={(option, value) => option.id === value.id}
        getOptionLabel={(option) =>
          option ? `${option.id} - ${option.name || 'Sem nome'}` : ''
        }
        filterOptions={(options) => options}
        renderOption={(option) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <strong>{option.id}</strong>
            &nbsp;-&nbsp;
            <span>{option.name || 'Sem nome'}</span>
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Digite o código do vendedor..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        )}
        noOptionsText="Nenhum vendedor encontrado"
        loadingText="Buscando..."
      />
    </Box>
  );
}