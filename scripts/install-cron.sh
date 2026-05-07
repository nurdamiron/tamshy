#!/bin/bash
# scripts/install-cron.sh
#
# Устанавливает /etc/cron.d/tamshy-news → daily news ingest.
# Запускать на EC2 от root.

set -e

CRON_FILE=/etc/cron.d/tamshy-news
LOGROTATE_FILE=/etc/logrotate.d/tamshy-news

echo "── cron entry → $CRON_FILE"
cat > "$CRON_FILE" <<'CRON'
# Tamshy: ежедневный ингест новостей министерства водных ресурсов с gov.kz.
# Запускается каждый день в 06:15 (UTC) — это 11:15 по Астане (UTC+5).
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOME=/root

15 6 * * * root /app/scripts/cron-news-ingest.sh
CRON
chmod 644 "$CRON_FILE"
chmod +x /app/scripts/cron-news-ingest.sh

echo "── logrotate → $LOGROTATE_FILE"
cat > "$LOGROTATE_FILE" <<'LOGROTATE'
/var/log/tamshy-news.log {
    weekly
    rotate 8
    missingok
    notifempty
    compress
    delaycompress
    copytruncate
}
LOGROTATE

# Создадим лог-файл с правильными правами, если его нет
touch /var/log/tamshy-news.log
chmod 644 /var/log/tamshy-news.log

# Проверка
echo ""
echo "── проверка ──"
ls -la "$CRON_FILE" "$LOGROTATE_FILE" /app/scripts/cron-news-ingest.sh /var/log/tamshy-news.log
echo ""
echo "Cron установлен. Следующий запуск: завтра в 06:15 UTC (11:15 Астана)"
echo "Запустить вручную сейчас: sudo /app/scripts/cron-news-ingest.sh"
echo "Смотреть логи: tail -f /var/log/tamshy-news.log"
