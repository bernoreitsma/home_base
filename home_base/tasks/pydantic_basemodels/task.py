from pydantic import BaseModel, NonNegativeInt, constr, field_validator

from tasks.models import Task


class CreateTaskBody(BaseModel):
    # see https://github.com/pydantic/pydantic/discussions/7047
    description: constr(max_length=1000)  # type: ignore
    category: Task.TaskCategory

    @field_validator("category", mode="before")
    @classmethod
    def to_upper(cls, value: str) -> str:
        return value.upper()


class DeleteTaskBody(BaseModel):
    task_id: NonNegativeInt


class UpdateTaskBody(BaseModel):
    task_id: NonNegativeInt
    # see https://github.com/pydantic/pydantic/discussions/7047
    description: constr(max_length=1000)  # type: ignore
    notes: constr(max_length=1000) | None = None  # type: ignore
    status: Task.TaskStatus
    category: Task.TaskCategory | None = None
    marked: bool = False

    @field_validator("category", mode="before")
    @classmethod
    def category_to_upper(cls, value: str | None) -> str | None:
        return value.upper() if isinstance(value, str) else value

    @field_validator("status", mode="before")
    @classmethod
    def status_to_upper(cls, value: str) -> str:
        return value.upper() if isinstance(value, str) else value
