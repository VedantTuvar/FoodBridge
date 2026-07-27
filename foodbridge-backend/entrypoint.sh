#!/bin/sh

if [ "$POSTGRES_DB" = "foodbridge_db" ]; then
    echo "Waiting for PostGIS database..."
    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done
    echo "PostGIS Database started."
fi

exec "$@"
