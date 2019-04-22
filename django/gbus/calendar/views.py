# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import Events

import json

# Create your views here.
def index(request):
    """Handle the home page of the Calendar.

    If the user is logged in, then go to the calendar. Otherwise go to the
    login page

    :param obj request: an HttpRequest object with a user that made the request
    :returns: a URL reqdirect to the page the calendar should go to

    """
    if request.user.is_authenticated():
        # go to main calendar
        return render(request, 'calendar/index.html')
    else:
        # go to login page
        return redirect(reverse('login'))

@ensure_csrf_cookie
def get_data(request):
    """Get a User's account data (events, deadlines, settings, and username)

    :param obj request: an HttpRequest that contains a user and their id
    :returns:           an HttpResponse with a JSON string in the form:

    {
        "events": <list of event JSON strings>,
        "deadlines": <list of event JSON strings>,
        "settings": <JSON string containing the settings for the account>,
        "username": <username of the the account data was requested from>
    }

    """

    # get the database object
    events_obj = Events.objects.get(id=request.user.id)

    # create the JSON string to return from the user's events information
    resp = "{\"events\": %s, \"deadlines\": %s, \"settings\": %s, \"username\": \"%s\"}" % (
        events_obj.events,
        events_obj.deadlines,
        events_obj.user_settings,
        events_obj.username
    )

    # create the response
    response = HttpResponse(resp)

    # set the username in a cookie so it is more easily accessible
    response.set_cookie('username', events_obj.username)

    return response

@ensure_csrf_cookie
def set_data(request):
    """Sets a User's account data

    :param obj request: an HttpRequest that contains a user and their id
                        along with a a body containing a JSON string in the
                        following form:

    {
        "events": <list of event JSON strings>,
        "deadlines": <list of event JSON strings>,
        "settings": <JSON string containing the settings for the account>,
    }

    :returns:           an HttpResponse with the database object created
                        as a string

    """
    # find the user's current account info in the database
    events_obj = Events.objects.get(id=request.user.id)

    # parse the JSON in the request
    req_json = json.loads(request.body.decode('utf-8'))

    # change the database object to the new values
    events_obj.events = req_json['events']
    events_obj.deadlines = req_json['deadlines']
    events_obj.user_settings = req_json['settings']

    # update the database
    events_obj.save()

    return HttpResponse(events_obj)

