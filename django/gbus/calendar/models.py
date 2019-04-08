# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Events(models.Model):
    events = models.TextField()
    deadlines = models.TextField()
    username = models.CharField(max_length=150, default='anon')

    def __str__(self):
        return "[Username: {}], [Events: {}], [Deadlines: {}]".format(self.username, self.events, self.deadlines)
