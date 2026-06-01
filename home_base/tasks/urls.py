from django.urls import path

from tasks.apis.update_order import UpdateOrder

from . import views

urlpatterns = [
    path("", views.TaskListView.as_view(), name="index"),
    path("api/update-order", UpdateOrder.as_view())
]