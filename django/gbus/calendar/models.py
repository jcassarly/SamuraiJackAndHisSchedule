# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Events(models.Model):
    events = models.TextField()
    deadlines = models.TextField()

    def __str__(self):
        return "[Events: {}], [Deadlines: {}]".format(self.events, self.deadlines)
