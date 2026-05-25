from django.db import models

class Task(models.Model):

    class TaskStatus(models.TextChoices):
        TODO = "TODO"
        DONE = "DONE"
        IN_PROGRESS = "IN_PROGRESS"

    class TaskCategory(models.TextChoices):
        IMPORTANT = "IMPORTANT"
        FUN = "FUN"
        SMALL = "SMALL"

    rank = models.IntegerField()
    description = models.CharField(max_length=1000)
    notes = models.CharField(max_length=1000, null=True, blank=True)
    status = models.CharField(max_length=25, choices=TaskStatus, default=TaskStatus.TODO)
    marked = models.BooleanField(default=False)
    category = models.CharField(max_length=25, choices=TaskCategory, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["rank"],
                deferrable=models.Deferrable.DEFERRED,
                name="unique_rank_deferrable"
            )
        ]
