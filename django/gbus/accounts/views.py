from django.shortcuts import render

# Create your views here.

from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy, reverse
from django.http import HttpResponseRedirect
from django.views import generic
from calendar.views import Events

def create_new_user_event_data(user):
    empty_json_obj = {}.__str__()

    # create the Events database object with the default values
    new_events = Events(
        events=empty_json_obj,
        deadlines=empty_json_obj,
        user_settings=empty_json_obj,
        username=user.username
    )

    # update the Events database
    new_events.save()

class GBUSUserCreationForm(UserCreationForm):

    def save(self, commit=True):
        """Modifies the save behavior of user creation to also create an Events object
        to handle account data.

        :param bool commit: whether or not to commit the new user to the auth database
        :returns:           an HttpRedirect back to the home page

        """
        # create the user account in the auth database
        usr = super(GBUSUserCreationForm, self).save(commit=commit)

        # create a new Events database object
        create_new_user_event_data(usr)

        # redirect back to the home screen
        return HttpResponseRedirect('/')

class SignUp(generic.CreateView):
    """Add a view to handle user creation."""
    # use the above form that has modified save behavior
    form_class = GBUSUserCreationForm
    success_url = reverse_lazy('login')  # lookup the login url by name when urls available
    template_name = 'signup.html'
