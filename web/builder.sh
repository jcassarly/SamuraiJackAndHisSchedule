#!/bin/bash
sudo rm ./build/bundle.js
sudo rm ./build/bundle.js.map
npm run build
mkdir ../django/gbus/calendar/static
sudo rm ../django/gbus/calendar/static/bundle.js
sudo rm ../django/gbus/calendar/static/bundle.js.map
cp ./build/* ../django/gbus/calendar/static/
cd ../django/gbus
python manage.py runserver 0.0.0.0:8000
