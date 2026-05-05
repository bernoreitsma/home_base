from django.db import models

class Song(models.Model):
    name = models.CharField(max_length=250)
    duration = models.DurationField()

    # we allow songs without albums to be saved.
    album = models.ForeignKey("Album", blank=True, null=True, on_delete=models.SET_NULL)

    # the artists of an album are not constrained to the artists of a song,
    # so collaborations on a studio album can be indexed.
    artists = models.ManyToManyField("Artist", related_name="songs")