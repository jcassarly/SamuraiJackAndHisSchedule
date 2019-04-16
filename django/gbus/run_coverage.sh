#!/bin/bash
coverage run --source="." manage.py test calendar accounts
coverage report -m
