#!/bin/bash
npm run build
cp ./build/* ../django/gbus/calendar/static/
cd ../django/gbus
python manage.py runserver
