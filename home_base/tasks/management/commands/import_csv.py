import pathlib
from django.core.management.base import BaseCommand, CommandError

from tasks.integrations.import_spreadsheet import CSVImporter

class Command(BaseCommand):
    help = "Imports old spreadsheet as csv file"

    def add_arguments(self, parser):
        parser.add_argument("path", type=pathlib.Path)

    def handle(self, *args, **options):
        CSVImporter(str(options["path"])).import_csv()