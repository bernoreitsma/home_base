from django.db import transaction

from tasks.models import Task


class TaskLogic:

    @staticmethod
    def update_order_to(new_order: list[int]) -> int:
        old_to_new_order = dict(zip(new_order, range(len(new_order))))

        old_to_new_updates = {old: new for old, new in old_to_new_order.items() if old != new}

        tasks_to_update = Task.objects.filter(rank__in=old_to_new_updates).order_by("rank")

        for task in tasks_to_update:
            task.rank = old_to_new_updates[task.rank]
        
        return Task.objects.bulk_update(
            tasks_to_update, ["rank"]
        )

    @staticmethod
    @transaction.atomic
    def delete_task_by_rank(task_rank: int) -> int:
        Task.objects.filter(rank=task_rank).delete()

        tasks_to_decrement = Task.objects.filter(rank__gte=task_rank)
        for task in tasks_to_decrement:
            task.rank -= 1

        return Task.objects.bulk_update(
            tasks_to_decrement, ["rank"]
        )