from pydantic import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView, Request

from tasks.logic.task import TaskLogic
from tasks.models import Task
from tasks.pydantic_basemodels.task import CreateTaskBody, DeleteTaskBody, UpdateTaskBody
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
            rank=Task.objects.count(),
            description=request_body.description,
            status=Task.TaskStatus.TODO,
            category=request_body.category,
        )

        task.save()

        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)

    def put(self, request: Request):
        request_data = request.data

        try:
            request_body = UpdateTaskBody(**request_data)
        except ValidationError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        try:
            task = TaskLogic.update_task(
                task_id=request_body.task_id,
                description=request_body.description,
                notes=request_body.notes,
                status=request_body.status,
                category=request_body.category,
                marked=request_body.marked,
            )
        except Task.DoesNotExist:
            return Response(f"Task with id {request_body.task_id} not found.", status=status.HTTP_404_NOT_FOUND)

        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)

    def delete(self, request: Request):
        request_data = request.data

        try:
            request_body = DeleteTaskBody(**request_data)
        except ValidationError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        try:
            tasks_updated = TaskLogic.delete_task_by_id(request_body.task_id)
        except Task.DoesNotExist:
            return Response(f"Task with id {request_body.task_id} not found.", status=status.HTTP_404_NOT_FOUND)

        return Response(f"Task deleted and ranks of {tasks_updated} task ranks updated.", status.HTTP_200_OK)
