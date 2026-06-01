

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
