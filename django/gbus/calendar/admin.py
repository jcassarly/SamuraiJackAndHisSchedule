# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Events

# Registers the account data object in the database
admin.site.register(Events)
