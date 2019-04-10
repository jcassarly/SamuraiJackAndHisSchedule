from django.shortcuts import render

# Create your views here.

from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy, reverse
from django.http import HttpResponseRedirect
from django.views import generic
from calendar.views import Events

class GBUSUserCreationForm(UserCreationForm):

    def save(self, commit=True):
        # create the user account in the auth database
        f = super(GBUSUserCreationForm, self).save(commit=commit)

        empty_json_obj = {}.__str__()

        # create the Events database object with the default values
        new_events = Events(
            events=empty_json_obj,
            deadlines=empty_json_obj,
            user_settings=empty_json_obj,
            username=f.username
        )

        # update the Events database
        new_events.save()

        # redirect back to the home screen
        return HttpResponseRedirect('/')

class SignUp(generic.CreateView):
    form_class = GBUSUserCreationForm
    success_url = reverse_lazy('login')  # lookup the login url by name when urls available
    template_name = 'signup.html'
