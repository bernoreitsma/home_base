from pydantic import BaseModel, field_validator

class UpdateOrderBody(BaseModel):
    new_order: list[int]

    @field_validator("new_order", mode='after')
    @classmethod
    def check_if_all_numbers_present(cls, value: list[int]) -> list[int]:
        """
        Check if all numbers from 1 to n are present in
        """
        if list(range(len(value))) != sorted(value):
            raise ValueError("Invalid order")
        return value
