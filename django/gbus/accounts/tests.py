# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from . import views

import json

TEST_USERNAME = 'tester2'
TEST_EMAIL    = 'tester2@test.com'
TEST_PASSWORD = 'yeet1234'

HTTP_REDIRECT = 302
HTTP_OK       = 200

class UserCreationTest(TestCase):
    def test_sets_new_data(self):
        """Checks that the signup form successfully executes."""

        # created the user data
        user_data = {"username": TEST_USERNAME, "password1": TEST_PASSWORD, "password2": TEST_PASSWORD}

        # create a form and fill it in with the user data
        form = views.GBUSUserCreationForm(user_data)

        # verify all the fields are filled
        self.assertTrue(form.is_valid())

        # save the form
        form.save()

        # login the user
        response = self.client.post(reverse('login'), {'username': TEST_USERNAME, 'password': TEST_PASSWORD})

        # check that the user was redirected to the calendar page
        self.assertEquals(response.status_code, HTTP_REDIRECT)

        # call the get_data view method
        data = self.client.get('/proto/get/')

        # check that the data is what was in the database by default
        self.assertEquals(data.getvalue(), b'{"events": {}, "deadlines": {}, "settings": {}, "username": "tester1"}')
