from django.core.management.base import BaseCommand
from core.models import Move, Item

from io import StringIO

import httpx
import pandas as pd

MOVE_TYPES = [
    "bug",
    "dark",
    "dragon",
    "electric",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water",
]


class Command(BaseCommand):
    help = "Seeds database with pokemon species information."

    def _load_species(self):
        pass

    def _load_items(self):
        url = "https://bulbapedia.bulbagarden.net/wiki/List_of_items_by_index_number_in_Generation_III"
        response = httpx.get(url)
        html = response.text

        # find the table on the screen that has "master ball" inside it...
        item_table = pd.read_html(io=StringIO(html), match="Master Ball")[0].drop(
            index=[0, 1, 3], axis=1
        )
        item_table.columns = ["id", "hex_id", "bag_sprite", "item_description"]

        item_table = item_table.drop(
            index=item_table[
                item_table["item_description"].str.contains("unknown", regex=False)
            ].index
        )
        item_table = item_table.drop(
            index=item_table[
                item_table["item_description"].str.contains("Nothing", regex=False)
            ].index
        )
        item_table = item_table.drop(
            index=item_table[item_table["id"].str.contains("#", regex=False)].index
        )

        new_items = item_table.apply(
            lambda r: (
                Item(
                    id=int(r["id"]),
                    name=r["item_description"],
                )
            ),
            axis=1,
        )
        Item.objects.bulk_create(list(new_items))

    def _load_moves(self):
        base_url = "https://www.serebii.net/attackdex/%s.shtml"
        
        # fetch bulbapedia list of moves to get indexes...
        # combine name and convert it to lower case to compare
        # and avoid issues with names like dynamicpunch

        for move_type in MOVE_TYPES:
            response = httpx.get(base_url % move_type)

            html = response.text
            tables = pd.read_html(io=StringIO(html), match="Effect")
            move_table = tables[1].drop([0], axis=0)
            move_table.columns = [
                "name",
                "type",
                "PP",
                "power",
                "accuracy",
                "effect",
                "contest_type",
            ]

            moves = move_table.apply(
                lambda r: Move(
                    name=r["name"],
                    effect=r["effect"],
                    move_type=move_type.upper(),
                    power=(int(r["power"]) if r["power"] != "--" else 0),
                    accuracy=(int(r["accuracy"]) if r["accuracy"] != "--" else 0),
                    pp=r["PP"],
                ),
                axis=1,
            )
            moves = list(moves)

            # insert them into the database
            Move.objects.bulk_create(moves)

    def handle(self, *args, **options):
        self._load_items()
        # self._load_moves()
        self._load_species()
