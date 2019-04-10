#!/bin/bash
coverage run --source="." manage.py test calendar
coverage report
