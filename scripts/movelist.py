#!/usr/bin/env python
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

BASE_URL = 'https://www.serebii.net/attackdex/'

def main():
    response = httpx.get(BASE_URL)
    html = response.text
    df = pd.read_html(io=html)[0].dropna()
    df = df[df.iloc[:, 7].str.match('^(I|II|III)$')].set_axis(
        ['move_id', 'name', 'type', 'category', 'pp', 'power', 'accuracy', 'gen'],
        axis=1,
    )
    print(df)

if __name__ == '__main__':
    main()
