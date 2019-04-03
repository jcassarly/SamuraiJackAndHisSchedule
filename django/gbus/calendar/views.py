# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie

import json

# Create your views here.
def index(request):
    if request.user.is_authenticated():
        return render(request, 'calendar/index.html')
    else:
        return redirect('/accounts/login')

@ensure_csrf_cookie
def getData(request):
    req_json = json.loads(request.body)
    resp = "You said {}, The response: Hello!".format(req_json['name'])
    return HttpResponse(resp)
