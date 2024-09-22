#!/usr/bin/sh
systemctl stop lilycove.xyz
git pull
sh ./build.sh
uv run manage.py collectstatic --noinput
rm -rf /var/www/static/lilycove.xyz/*
cp -r static/* /var/www/static/lilycove.xyz
systemctl start lilycove.xyz
