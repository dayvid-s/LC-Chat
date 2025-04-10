#!/bin/bash

LOG_DIR="/root/LC-Chat/backend/logs"
BACKUP_DIR="/root/LC-Chat/log-backups"

echo "📁 Criando diretório de backup (se não existir)..."
mkdir -p "$BACKUP_DIR"

echo "📜 Criando configuração personalizada do logrotate..."
cat <<EOF > /etc/logrotate.d/lc-chat-logs
$LOG_DIR/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
    size 10M
}
EOF

echo "📦 Criando script de backup dos logs rotacionados..."
BACKUP_SCRIPT="/root/LC-Chat/backup_logs.sh"
cat <<EOF > $BACKUP_SCRIPT
#!/bin/bash
tar -czf $BACKUP_DIR/logs-\$(date +%Y-%m-%d).tar.gz -C $LOG_DIR .
EOF

chmod +x $BACKUP_SCRIPT

echo "⏱️ Agendando backup semanal (domingo às 23:30)..."
(crontab -l 2>/dev/null; echo "30 23 * * 0 $BACKUP_SCRIPT") | crontab -

echo "✅ Logrotate e backup configurados com sucesso!"