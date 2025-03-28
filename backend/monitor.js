const fs = require("fs");
const { exec } = require("child_process");

const logFile = "./logs/backend.log"; // Caminho do log do backend
const restartLog = "./logs/restart.log"; // Arquivo de logs de reinício
let lastRestart = 0; // Timestamp do último restart

fs.watchFile(logFile, { interval: 2000 }, () => {
  fs.readFile(logFile, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler logs:", err);
      return;
    }

    // Verifica se a última linha contém "app crashed"
    const lines = data.trim().split("\n");
    const lastLine = lines[lines.length - 1];

    if (lastLine.includes("app crashed")) {
      const now = Date.now();
      if (now - lastRestart < 30000) {
        // Evita reiniciar várias vezes em menos de 30s
        console.log("Reinício ignorado para evitar loop.");
        return;
      }

      console.log("Erro detectado! Reiniciando o backend...");
      lastRestart = now;

      exec("pm2 restart 'LC Chat Backend'", (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro ao reiniciar: ${error.message}`);
          return;
        }
        const logMessage = `[${new Date().toISOString()}] Backend reiniciado devido a 'app crashed'\n`;
        console.log(logMessage);
        fs.appendFile(restartLog, logMessage, err => {
          if (err) console.error("Erro ao salvar log de reinício:", err);
        });
      });
    }
  });
});
