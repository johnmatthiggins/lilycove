import time
from io import StringIO

from django.core.management.base import BaseCommand
from core.models import Item, Species, Move, Ability

from thefuzz import fuzz
import httpx
from bs4 import BeautifulSoup
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

    # there is an attack named psychic so basically we
    # have to append 't' to get the list of psychic type attacks.
    "psychict",
    "rock",
    "steel",
    "water",
]


class Command(BaseCommand):
    help = "Seeds database with pokemon species information."

    def _load_species(self):
        # fetch list of pokemon...
        # bind pokemon to their species id and dex id
        # hit serebii and scrape tables to get list of learnable moves.
        experience_type_url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_experience_type'
        response = httpx.get(experience_type_url)
        html = response.text
        experience_table = pd.read_html(io=StringIO(html))[0].iloc[:386]
        experience_table.columns = ['dex_id', 'image', 'name', 'rate']
        growth_rates = dict(list(experience_table.apply(lambda r: [r['dex_id'], str(r['rate']).lower()], axis=1)))

        all_pokemon_url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_index_number_in_Generation_III'
        response = httpx.get(all_pokemon_url)

        html = response.text
        pokemon_table = pd.read_html(io=StringIO(html), skiprows=1)[0]
        pokemon_table.columns = ['hex', 'dec', 'ms', 'name', 'type1', 'type2']
        pokemon_table['name'] = pokemon_table['name'].apply(
            lambda r: (str(r)
                .replace(b'\xe2\x99\x80'.decode('utf8'), ' (F)')
                .replace(b'\xe2\x99\x82'.decode('utf8'), ' (M)')
                .strip()
                .lower())
        )

        base_url = 'https://www.serebii.net/pokedex-rs/%s.shtml'

        new_pokemon = []

        # Bulbasaur to Deoxys
        for i in range(1, 386 + 1):
            pokedex_id = str(i).zfill(3)
            page_url = base_url % pokedex_id

            response = httpx.get(page_url)
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')
            entry_name = soup.find(attrs={"size":"4"}).find('b').text
            pokemon_name = (entry_name
                .strip()
                .replace(f'#{pokedex_id} ', '')
                .strip())

            print('PROCESSING ', pokemon_name)

            ability_text = soup.find('td', attrs={"colspan":4}).b.text
            if '&'  in ability_text:
                abilities = [ability_text.replace('Ability: ', '')]
            else:
                abilities = list(ability_text.replace('Ability: ', '').split(' & '))

            matching_row = pokemon_table[pokemon_table['name'] == pokemon_name.lower()]
            species_id = int(matching_row['dec'].iloc[0], 10)

            type1 = matching_row['type1'].iloc[0]
            type2 = matching_row['type2'].iloc[0]

            table_html = soup.find('td', string="Base Stats").parent.parent

            base_stats = pd.read_html(io=StringIO(str(table_html)), skiprows=2)[0]
            base_stats.columns = ["description", "hp", "atk", "def", "satk", "sdef", "speed"]

            growth_rate = growth_rates[i]

            pokemon_species = Species(
                name=pokemon_name,
                species_id=species_id,
                pokedex_id=i,
                type1=type1,
                type2=type2,
                hp=int(base_stats['hp'].iloc[0]),
                attack=int(base_stats['atk'].iloc[0]),
                defense=int(base_stats['def'].iloc[0]),
                speed=int(base_stats['speed'].iloc[0]),
                special_attack=int(base_stats['satk'].iloc[0]),
                special_defense=int(base_stats['sdef'].iloc[0]),
                growth_rate=growth_rate
            )
            Species.abilities = list([Ability(name=ability) for ability in abilities])
            print(pokemon_species)
            new_pokemon.append(pokemon_species)

        return new_pokemon

    def _load_items(self):
        url = "https://bulbapedia.bulbagarden.net/wiki/List_of_items_by_index_number_in_Generation_III"
        response = httpx.get(url)
        html = response.text

        # find the table on the screen that has "master ball" inside it...
        item_table = pd.read_html(io=StringIO(html), match="Master Ball")[0].drop(
            index=[0, 1, 3], axis=1
        )
        item_table.columns = ["id", "hex_id", "bag_sprite", "desc"]
        item_table = (
            item_table.drop(
                index=item_table[
                    item_table["desc"].str.contains("unknown", regex=False)
                ].index
            )
            .drop(
                index=item_table[
                    item_table["desc"].str.contains("Nothing", regex=False)
                ].index
            )
            .drop(
                index=item_table[item_table["id"].str.contains("#", regex=False)].index
            )
        )

        new_items = item_table.apply(
            lambda r: (Item(item_id=int(r["id"]), name=r["desc"])),
            axis=1,
        )
        return list(new_items)

    def _load_moves(self):
        bulbapedia_url = "https://bulbapedia.bulbagarden.net/wiki/List_of_moves"

        response = httpx.get(bulbapedia_url)
        html = response.text

        # grab move table
        move_table = pd.read_html(io=StringIO(html), match="Pound")[0].drop([0,1])
        move_table.columns = [
            "id",
            "name",
            "move_type",
            "category",
            "pp",
            "power",
            "accuracy",
            "generation",
        ]
        move_pairings = list(move_table.apply(
            lambda r: [r["name"].lower().replace(' ', ''), int(r["id"])], axis=1)
        )

        base_url = "https://www.serebii.net/attackdex/%s.shtml"

        # fetch bulbapedia list of moves to get indexes...
        # combine name and convert it to lower case to compare
        # and avoid issues with names like dynamicpunch
        new_moves = []

        for move_type in MOVE_TYPES:
            response = httpx.get(base_url % move_type)

            # kinda weird but whatever...
            if move_type == "psychict":
                move_type = "psychic"

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

            def build_move(row, pairs):
                key = row['name'].lower().replace(' ', '')
                id = None
                similarity = 0
                for pair in pairs:
                    if fuzz.ratio(pair[0], key) > similarity:
                        similarity = fuzz.ratio(pair[0], key)
                        id = pair[1]


                if not id:
                    print('no id for ', row['name'])
                    return None

                return Move(
                    id=int(id),
                    name=row["name"],
                    effect=row["effect"],
                    move_type=move_type.upper(),
                    power=(int(row["power"]) if row["power"] != "--" else 0),
                    accuracy=(int(row["accuracy"]) if row["accuracy"] != "--" else 0),
                    pp=row["PP"],
                )

            moves = move_table.apply(lambda r: build_move(r, move_pairings), axis=1)
            new_moves += list(moves)

        # insert them into the database
        return new_moves

    # takes in list of moves...
    # def _load_movesets(self, movelist):
    #     # fetch list of pokemon...
    #     # bind pokemon to their species id and dex id
    #     # hit serebii and scrape tables to get list of learnable moves.
    #     all_pokemon_url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_index_number_in_Generation_III'
    #     response = httpx.get(all_pokemon_url)
    #
    #     html = response.text
    #     pokemon_table = pd.read_html(io=StringIO(html), skiprows=1)[0]
    #     pokemon_table.columns = ['hex', 'dec', 'ms', 'name', 'type1', 'type2']
    #
    #     base_url = 'https://www.serebii.net/pokedex-rs/%s.shtml'
    #
    #     # Bulbasaur to Deoxys
    #     for i in range(1, 358 + 1):
    #         pokedex_id = str(i).zfill(3)
    #         page_url = base_url % pokedex_id
    #
    #         response = httpx.get(page_url)
    #         html = response.text
    #         soup = BeautifulSoup(html, 'html.parser')
    #         entry_name = soup.find(attrs={"size":"4"}).find('b').text
    #         pokemon_name = entry_name.split(' ')[1]
    #         game_id = int(pokemon_table[pokemon_table['name'] == pokemon_name]['dec'][0], 10)


    def handle(self, *args, **options):
        start = time.time()

        print('LOADING ITEMS...')
        items = self._load_items()
        Item.objects.bulk_create(items, ignore_conflicts=True)
        print('FINISHED LOADING ITEMS...')

        print('LOADING MOVES...')
        moves = self._load_moves()

        for move in moves:
            print(move)

        Move.objects.bulk_create(moves)

        print('FINISHED LOADING MOVES...')

        print('LOADING SPECIES DATA...')
        pokemon = self._load_species()
        Species.objects.bulk_create(pokemon, update_conflicts=True)
        print('FINISHED LOADING SPECIES DATA...')

        end = time.time()

        print('SEEDED DATABASE IN %s SECONDS...' %(str(end - start)))

        # self._load_movesets([])
