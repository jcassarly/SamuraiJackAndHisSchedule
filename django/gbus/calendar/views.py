# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect

# Create your views here.
def index(request):
    if request.user.is_authenticated():
        return render(request, 'calendar/index.html')
    else:
        return redirect('/accounts/login')
