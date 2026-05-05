from django.contrib import admin
from music.models import Album

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'duration', 'get_artists')

    def get_artists(self, obj):
        return ", ".join(artist.name for artist in obj.artists.all())
    get_artists.short_description = 'Artist'
