from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^proto/get', views.get_data),
    url(r'^proto/set', views.set_data),
]
