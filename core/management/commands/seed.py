from django.core.management.base import BaseCommand, CommandError
from core.models import Move

from io import StringIO
import httpx
import pandas as pd

MOVE_TYPES = [
    'bug',
    'dark',
    'dragon',
    'electric',
    'fighting',
    'fire',
    'flying',
    'ghost',
    'grass',
    'ground',
    'ice',
    'normal',
    'poison',
    'psychic',
    'rock',
    'steel',
    'water',
]

class Command(BaseCommand):
    help = "Seeds database with pokemon species information."

    def _load_species(self):
        pass

    def _load_items(self):
        url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_items_by_index_number_in_Generation_III'
        response = httpx.get(url)
        html = response.text

        # find the table on the screen that has "master ball" inside it...
        tables = pd.read_html(io=StringIO(html), match="Master Ball")
        print(tables)

    def _load_moves(self):
        base_url = 'https://www.serebii.net/attackdex/%s.shtml'
        for move_type in MOVE_TYPES:
            response = httpx.get(base_url % move_type)

            html = response.text
            tables = pd.read_html(io=StringIO(html), match='Effect')
            move_table = tables[1].drop([0], axis=0)
            move_table.columns = [
                'name', 'type', 'PP', 'power', 'accuracy', 'effect', 'contest_type'
            ]

            moves = move_table.apply(
                    lambda r: Move(
                        name=r['name'],
                        move_type=move_type.upper(),
                        power=r['power'],
                        accuracy=r['accuracy'],
                        pp=r['PP'],
                    ),
                    axis=1,
            )
            moves = list(moves)
            print('moves = ', moves)

            # insert them into the database
            # Move.objects.bulk_create(moves)


    def handle(self, *args, **options):
        self._load_items()
        self._load_moves()
        self._load_species()

