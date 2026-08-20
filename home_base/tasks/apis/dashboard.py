from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView, Request

from tasks.models import Task
from tasks.serializers.task import TaskSerializer


class TaskDashboardView(APIView):
    def get(self, request: Request):
        tasks_base_queryset = Task.objects.all().order_by("rank")

        dashboard_tasks = [
            list(tasks_base_queryset.filter(category=task_category)) for task_category in Task.TaskCategory.names
        ]

        rows = zip(*dashboard_tasks)

        display_rows: list[Task] = []

        for row in rows:
            if all(task.status == Task.TaskStatus.DONE for task in row):
                continue
            display_rows.extend(row)
            if all(task.status == Task.TaskStatus.TODO for task in row):
                break

        return Response(TaskSerializer(display_rows, many=True).data, status=status.HTTP_200_OK)
