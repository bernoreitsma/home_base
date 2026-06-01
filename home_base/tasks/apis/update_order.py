from pydantic import ValidationError
from rest_framework import status
from rest_framework.views import APIView, Request
from rest_framework.response import Response

from tasks.logic.task import TaskLogic
from tasks.pydantic_basemodels.update_order import UpdateOrderBody

class UpdateOrder(APIView):

    def post(self, request: Request, format=None):
        request_data = request.data
        try:
            request_body = UpdateOrderBody(**request_data)
        except ValidationError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        tasks_updated = TaskLogic.update_order_to(request_body.new_order)

        return Response(f"{tasks_updated} task ranks updated.", status.HTTP_200_OK)




        