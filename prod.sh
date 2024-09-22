#!/usr/bin/env sh

# Script that runs production Django server on port specified by ENV
HOST=127.0.0.1
PORT=8000
cd "$(dirname $0)";

export DEBUG=FALSE;
uv run gunicorn lilycove.asgi:application -w 8 -k uvicorn_worker.UvicornWorker
