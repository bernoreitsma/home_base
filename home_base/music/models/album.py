from django.db import models

class Album(models.Model):
    name = models.CharField(max_length=200)
    duration = models.DurationField()
    # there can be more artists working on a studio album, e.g. a split.
    # not every collaborator needs to be in the main artist of the album.
    artists = models.ManyToManyField("Artist", related_name="albums")

    def __str__(self):
        return self.name