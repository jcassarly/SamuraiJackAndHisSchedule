#!/bin/bash
sudo rm ./build/bundle.js
sudo rm ./build/bundle.js.map
npm run build
sudo rm ../django/gbus/calendar/static/bundle.js
sudo rm ../django/gbus/calendar/static/bundle.js.map
cp ./build/* ../django/gbus/calendar/static/
cd ../django/gbus
python manage.py runserver
