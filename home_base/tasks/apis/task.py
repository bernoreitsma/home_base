from pydantic import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.views import APIView, Request


from tasks.models import Task
from tasks.pydantic_basemodels.task import CreateTaskBody

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class TaskAPIView(APIView):
    
    def post(self, request: Request, format=None):
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
