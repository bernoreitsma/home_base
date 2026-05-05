from django.db import models

class Top35(models.Model):
    year = models.IntegerField()
    songs = models.ManyToManyField("Song", related_name="top_35")
