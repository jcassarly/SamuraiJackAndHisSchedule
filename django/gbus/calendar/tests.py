# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from accounts.views import GBUSUserCreationForm
from . import views

import json

TEST_USERNAME = 'tester1'
TEST_EMAIL    = 'tester1@test.com'
TEST_PASSWORD = 'yeet1234'

HTTP_REDIRECT = 302
HTTP_OK       = 200

class EventsViewsTest(TestCase):
    def setUp(self):
        """Sets up a user to run tests with before running other tests."""

        # create the user
        self.user_1 = User.objects.create_user(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD)
        self.user_1.save()

        # create the user data
        self.user_1_data = views.Events(username=TEST_USERNAME, events=r'{}', deadlines=r'{}', user_settings=r'{}')
        self.user_1_data.save()

    def login(self):
        """Logs in the user from setUp."""
        # login the user
        response = self.client.post(reverse('login'), {'username': TEST_USERNAME, 'password': TEST_PASSWORD})

        # check that the user was redirected
        self.assertEquals(response.status_code, HTTP_REDIRECT)

    def tests_not_logged_in_redirects(self):
        """Checks that when the user is not logged in they get redirected."""
        # go to home
        response = self.client.get('/')

        # check that a redirect occurred
        self.assertEquals(response.status_code, HTTP_REDIRECT)

    def tests_home_when_logged_in(self):
        """Checks that when the user is logged in that they no dot get redirected"""
        # login the user
        self.login()

        # go to home
        response = self.client.get('/')

        # check that the user was sent to home and not redirected
        self.assertEquals(response.status_code, HTTP_OK)

    def test_gets_starting_data(self):
        """Checks that the get_data method pulls the user data from the database."""
        # login the user
        self.login()

        # call the get_data view method
        data = self.client.get('/proto/get/')

        # check that the data is what was in the database by default
        self.assertEquals(data.getvalue(), b'{"events": {}, "deadlines": {}, "settings": {}, "username": "tester1"}')

    def test_sets_new_data(self):
        """Checks that the set_data method changes the data in teh database correctly."""
        # login the user
        self.login()

        # created the expected JSON result object
        obj = json.dumps({"events":r"{\"0\":{}}","deadlines":r"{\"0\":{}}","settings":r"{}"})

        # call the set_data view method
        data = self.client.post('/proto/set/', content_type='application/json', data=obj)

        # check that the database was correctly updated
        self.assertEquals(data.getvalue(), b'[Username: tester1]\n\n[Events: {\\"0\\":{}}]\n\n[Deadlines: {\\"0\\":{}}]\n\n[user_settings: {}]')
