from pydantic import BaseModel, field_validator


class UpdateOrderBody(BaseModel):
    # Task ids in the desired order; position in the list is the new rank.
    task_ids: list[int]

    @field_validator("task_ids", mode="after")
    @classmethod
    def check_no_duplicates(cls, value: list[int]) -> list[int]:
        if len(set(value)) != len(value):
            raise ValueError("Invalid order: duplicate task ids")
        return value
