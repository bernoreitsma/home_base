from django.db import models

class Top6(models.Model):
    year = models.IntegerField()
    edition = models.IntegerField()

    songs = models.ManyToManyField("Song", related_name="top_6")