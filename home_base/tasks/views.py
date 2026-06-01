from django.views.generic.list import ListView

from tasks.models import Task

# Create your views here.
class TaskListView(ListView):
    model = Task
    queryset = Task.objects.all().order_by("rank")
