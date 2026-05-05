from django.contrib import admin

from tasks.models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("rank", "description", "category", "notes", "status", "marked")
    search_fields = ("description", "notes")
    ordering = ("rank",)