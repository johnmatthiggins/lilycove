#!/usr/bin/env sh

# Script that runs production Django server on port specified by ENV
HOST=127.0.0.1
PORT=8000
cd "$(dirname $0)";

test -f /root/.local/bin/poetry && export PATH="$PATH:/root/.local/bin/";

export DEBUG=FALSE;
if which poetry; then
	poetry run python -m gunicorn lilycove.asgi:application -w 8 -k uvicorn_worker.UvicornWorker
else
	/root/.local/bin/poetry run python -m gunicorn lilycove.asgi:application -w 8 -k uvicorn_worker.UvicornWorker
fi
