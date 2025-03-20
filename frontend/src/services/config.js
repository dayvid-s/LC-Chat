import { loadJSON } from "../helpers/loadJSON";

// Tenta carregar o arquivo de configuração principal (config.json)
let config = loadJSON("/config.json");

// Se não encontrar o config.json e o hostname for localhost ou 127.0.0.1, carrega o arquivo config-dev.json
// if (!config && ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
//   config = loadJSON("/config-dev.json");
// }

// Se não encontrar nenhum arquivo de configuração, utiliza as configurações padrão para o backend
if (!config) {
  config = {
    "BACKEND_PROTOCOL": "https",  // Alterado para https
    "BACKEND_HOST": "lccomvc.digital",
    "BACKEND_PORT": "8090",
    "LOG_LEVEL": "debug"
  };
}

// Função para obter a URL do backend
export function getBackendURL() {
  return (
    config.REACT_APP_BACKEND_URL ||
    (config.BACKEND_PROTOCOL ?? "https") + "://" + // Usando https por padrão
    (config.BACKEND_HOST) + ":" + (config.BACKEND_PORT ?? "8090") + // Usando lccomvc.digital:8090 por padrão
    (config.BACKEND_PATH ?? "")
  );
}

// Função para obter a URL do WebSocket do backend
export function getBackendSocketURL() {
  return (
    config.REACT_APP_BACKEND_URL ||
    (config.BACKEND_PROTOCOL ?? "https") + "://" + // Usando https por padrão
    (config.BACKEND_HOST) + ":" + (config.BACKEND_PORT ?? "8090") // Usando lccomvc.digital:8090 por padrão
  );
}

export default config;