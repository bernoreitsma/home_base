import math

import pandas as pd
from django.db import transaction

from tasks.models import Task


class CSVImporter:
    """
    Imports a (cleaned) CSV. Ignores statuses or marks for now.
    """

    def __init__(self, filepath: str):
        self.filepath = filepath

    def import_csv(self):
        tasks = self.load_tasks()
        self.sync_tasks_to_db(tasks)

    def load_tasks(self) -> list[Task]:
        raw_tasks = pd.read_csv(self.filepath, header=None)
        raw_tasks = self._clean_rows(raw_tasks)
        tasks: list[Task] = []
        for raw_task in raw_tasks.iterrows():
            assert type(raw_task) is tuple[int, pd.Series]
            tasks.append(self._unpack_raw_task_row(raw_task))
        return tasks

    def _clean_rows(self, raw_tasks: pd.DataFrame) -> pd.DataFrame:
        """
        Magic function that cleans up all the irrelevant data.

        This function assumes the list of tasks start underneath "TAKEN".

        This function assumes that the first field after, whose row does not contain
        a category but does contain a task description.

        Not idea longterm, but if the format is not changed, this function won't break.
        """
        first_relevant_row_index = raw_tasks.index[raw_tasks[0] == "TAKEN"].start + 1
        raw_tasks_cleaned_above = raw_tasks.iloc[first_relevant_row_index:].reset_index(drop=True)

        last_relevant_row_index = raw_tasks_cleaned_above.index[
            ~raw_tasks_cleaned_above[0].isna() & raw_tasks_cleaned_above[1].isna()
        ].min()
        raw_tasks_cleaned_below = raw_tasks_cleaned_above.iloc[:last_relevant_row_index]

        raw_tasks_cleaned_below = raw_tasks_cleaned_below[~raw_tasks_cleaned_below[0].isnull()].reset_index(drop=True)

        return raw_tasks_cleaned_below

    def sync_tasks_to_db(self, tasks: list[Task]):
        with transaction.atomic():
            Task.objects.all().delete()
            Task.objects.bulk_create(tasks)

    def _unpack_raw_task_row(self, raw_task: tuple[int, pd.Series]) -> Task:
        """
        Convert raw task from csv row out of the dataframe into a Task object.
        """
        rank = int(raw_task[0])
        description = str(raw_task[1][0])
        category = str(raw_task[1][1])
        notes = self._unpack_notes(raw_task[1][2])

        category_translation_map = {"belangrijk": "important", "fijn": "fun", "klein": "small", "urgent": "urgent"}

        return Task(
            rank=rank,
            description=description,
            category=category_translation_map.get(category, "").upper() or None,
            notes=notes,
        )

    @staticmethod
    def _unpack_notes(notes) -> str | None:
        if isinstance(notes, float) and math.isnan(notes):
            notes = None
        return notes or None
