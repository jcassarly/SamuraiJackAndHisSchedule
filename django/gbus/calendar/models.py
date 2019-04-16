# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Events(models.Model):
    """Database object to handle user account data."""

    # create the fields in the account data object
    events = models.TextField()
    user_settings = models.TextField()
    deadlines = models.TextField()
    username = models.CharField(max_length=150, default='anon')

    def __str__(self):
        """Gives a string representation of the account data object."""

        return "[Username: {}]\n\n[Events: {}]\n\n[Deadlines: {}]\n\n[user_settings: {}]".format(
            self.username,
            self.events,
            self.deadlines,
            self.user_settings
        )
