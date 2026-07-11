from django.db import transaction

from tasks.models import Task


class TaskLogic:
    @staticmethod
    @transaction.atomic
    def update_order_to(task_ids: list[int]) -> int:
        id_to_new_rank = {task_id: rank for rank, task_id in enumerate(task_ids)}

        tasks_to_update = list(Task.objects.filter(id__in=id_to_new_rank))

        for task in tasks_to_update:
            task.rank = id_to_new_rank[task.id]

        return Task.objects.bulk_update(tasks_to_update, ["rank"])

    @staticmethod
    def update_task(
        task_id: int,
        description: str,
        notes: str | None,
        status: str,
        category: str | None,
        marked: bool,
    ) -> Task:
        task = Task.objects.get(id=task_id)  # raises Task.DoesNotExist if missing

        task.description = description
        task.notes = notes
        task.status = status
        task.category = category
        task.marked = marked
        task.save()

        return task

    @staticmethod
    @transaction.atomic
    def delete_task_by_id(task_id: int) -> int:
        task = Task.objects.get(id=task_id)  # raises Task.DoesNotExist if missing

        deleted_rank = task.rank
        task.delete()

        tasks_to_decrement = Task.objects.filter(rank__gt=deleted_rank)
        for task in tasks_to_decrement:
            task.rank -= 1

        return Task.objects.bulk_update(tasks_to_decrement, ["rank"])
