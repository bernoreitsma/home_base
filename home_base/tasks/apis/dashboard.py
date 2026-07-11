from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView, Request

from tasks.models import Task
from tasks.serializers.task import TaskSerializer


class TaskDashboardView(APIView):
    def get(self, request: Request):
        tasks_base_queryset = Task.objects.all().exclude(status=Task.TaskStatus.DONE).order_by("rank")

        dashboard_tasks = [
            tasks_base_queryset.filter(category=task_category).first() for task_category in Task.TaskCategory.names
        ]

        dashboard_tasks = list(filter(None, dashboard_tasks))

        return Response(TaskSerializer(dashboard_tasks, many=True).data, status=status.HTTP_200_OK)
