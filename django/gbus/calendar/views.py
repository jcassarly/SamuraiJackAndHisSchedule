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
    if request.user.is_authenticated():
        return render(request, 'calendar/index.html')
    else:
        return redirect(reverse('login'))

@ensure_csrf_cookie
def get_data(request):

    events_obj = Events.objects.get(id=request.user.id)
    resp = "{\"events\": %s, \"deadlines\": %s, \"username\": \"%s\"}" % (events_obj.events, events_obj.deadlines, events_obj.username)
    return HttpResponse(resp)

@ensure_csrf_cookie
def set_data(request):
    events_obj = Events.objects.get(id=request.user.id)
    req_json = json.loads(request.body.decode('utf-8'))

    events_obj.events = req_json['events']
    events_obj.deadlines = req_json['deadlines']

    events_obj.save()

    return HttpResponse(req_json['events'])
    #req_json = json.loads(request.body)
    #resp = "You said {}, The response: Hello!".format(req_json['name'])
    #return HttpResponse(resp)

