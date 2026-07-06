from pydantic import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.views import APIView, Request


from tasks.logic.task import TaskLogic
from tasks.models import Task
from tasks.pydantic_basemodels.task import CreateTaskBody, DeleteTaskBody
from tasks.serializers.task import TaskSerializer


class TaskListAPIView(APIView):

    def get(self, request: Request):
        tasks = Task.objects.all().order_by("rank")
        return Response(TaskSerializer(tasks, many=True).data, status=status.HTTP_200_OK)


class TaskAPIView(APIView):

    def post(self, request: Request):
        request_data = request.data
        
        try:
            request_body = CreateTaskBody(**request_data)
        except ValidationError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        task = Task(
            rank = Task.objects.count(),
            description = request_body.description,
            status = Task.TaskStatus.TODO,
            category = request_body.category
        )

        task.save()

        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)

    def delete(self, request: Request):
        request_data = request.data

        try:
            request_body = DeleteTaskBody(**request_data)
        except ValidationError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        tasks_updated = TaskLogic.delete_task_by_rank(request_body.task_rank)

        return Response(f"Task deleted and ranks of {tasks_updated} task ranks updated.", status.HTTP_200_OK)