from pydantic import BaseModel, NonNegativeInt, constr, field_validator

from tasks.models import Task


class CreateTaskBody(BaseModel):
    description: constr(max_length=1000)
    category: Task.TaskCategory
    
    @field_validator('category', mode='before')
    @classmethod
    def to_upper(cls, value: str) -> str:
        return value.upper()
    
class DeleteTaskBody(BaseModel):
    task_rank: NonNegativeInt