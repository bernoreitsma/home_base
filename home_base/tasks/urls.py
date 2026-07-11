from django.urls import path

from tasks.apis.dashboard import TaskDashboardView
from tasks.apis.task import TaskAPIView, TaskListAPIView
from tasks.apis.update_order import UpdateOrder

from . import views

urlpatterns = [
    path("", views.TaskListView.as_view(), name="index"),
    path("dashboard", views.TaskListView.as_view(), name="dashboard"),
    path("<int:task_id>/edit", views.TaskListView.as_view(), name="edit-task"),
    path("api/update-order", UpdateOrder.as_view()),
    path("api/tasks", TaskListAPIView.as_view()),
    path("api/dashboard", TaskDashboardView.as_view()),
    path("api/task", TaskAPIView.as_view())
]