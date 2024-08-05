#!/usr/bin/env python
import httpx
import pandas as pd

URL = 'https://bulbapedia.bulbagarden.net/wiki/List_of_moves'

def main():
    response = httpx.get(URL)
    html = response.text
    df = pd.read_html(io=html)[0].dropna()
    df = df[df.iloc[:, 7].str.match('^(I|II|III)$')].set_axis(
        ['move_id', 'name', 'type', 'category', 'pp', 'power', 'accuracy', 'gen'],
        axis=1,
    )
    print(df)

if __name__ == '__main__':
    main()
