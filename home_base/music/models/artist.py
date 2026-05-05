from django.db import models

from music.models.album import Album

class Artist(models.Model):
    name = models.CharField(max_length=250)

    album: Album

    def __str__(self):
        return self.name