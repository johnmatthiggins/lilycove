#!/usr/bin/env python
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

BASE_URL = 'https://www.serebii.net/attackdex/%s.shtml'

def main():
    for move_type in MOVE_TYPES:
        url = BASE_URL % move_type
        print('hitting %s' % url)
        response = httpx.get(BASE_URL % move_type)
        html = response.text
        tables = pd.read_html(io=StringIO(html), match='Effect')
        move_table = tables[1].drop([0], axis=0)
        move_table.columns = ['name', 'type', 'PP', 'power', 'accuracy', 'effect', 'contest_type']
        print(move_table)
        # df = df[df.iloc[:, 7].str.match('^(I|II|III)$')].set_axis(
        #     ['move_id', 'name', 'type', 'category', 'pp', 'power', 'accuracy', 'gen'],
        #     axis=1,
        # )

if __name__ == '__main__':
    main()
