#!/usr/bin/sh
systemctl stop lilycove.xyz
git pull
sh ./build.sh
poetry run python manage.py collectstatic
rm -rf /var/www/static/lilycove.xyz/*
cp -r static/* /var/www/static/lilycove.xyz
systemctl start lilycove.xyz
