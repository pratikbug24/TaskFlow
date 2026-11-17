#!/usr/bin/env bash
#
# Creates the TaskFlow database, loads the schema and seed data.
#
# Usage:
#   DB_HOST=127.0.0.1 DB_USER=taskflow DB_PASSWORD=taskflow_pass bash server/setup-db.sh
#
# The MySQL/MariaDB server must already be running, and the database user must
# exist (see README → "Database setup").

set -euo pipefail

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-taskflow}"
DB_USER="${DB_USER:-taskflow}"
DB_PASSWORD="${DB_PASSWORD:-taskflow_pass}"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mysql_cmd() {
  mysql --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --password="$DB_PASSWORD" "$@"
}

echo "Loading schema into $DB_NAME@$DB_HOST…"
mysql_cmd "$DB_NAME" < "$DIR/sql/schema.sql"

echo "Loading seed data…"
mysql_cmd "$DB_NAME" < "$DIR/sql/seed.sql"

echo "Done. Demo login: avery@taskflow.io / password123"
