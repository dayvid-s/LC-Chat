const config = {
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  LOG_LEVEL: "debug"
};

export function getBackendURL() {
  return config.BACKEND_URL;
}

export function getBackendSocketURL() {
  return config.BACKEND_URL;
}

export default config;