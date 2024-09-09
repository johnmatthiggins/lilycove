#!/usr/bin/env sh

# Script that runs production Django server on port specified by ENV
HOST=127.0.0.1
PORT=8000

poetry run python -m uvicorn lilycove.asgi:application
