#!/bin/bash
# Nightly SQLite backup script
# Usage: crontab -e
# 0 2 * * * /path/to/passports-app/scripts/backup-db.sh

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_PATH="${DB_PATH:-./passports.db}"
TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")

mkdir -p "$BACKUP_DIR"

if [ -f "$DB_PATH" ]; then
  cp "$DB_PATH" "$BACKUP_DIR/passports_$TIMESTAMP.db"
  # Keep only last 30 backups
  ls -t "$BACKUP_DIR"/passports_*.db | tail -n +31 | xargs -r rm
  echo "Backup created: $BACKUP_DIR/passports_$TIMESTAMP.db"
else
  echo "No database found at $DB_PATH"
fi
