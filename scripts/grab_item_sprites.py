#!/usr/bin/env python
import os
from pathlib import Path
from bs4 import BeautifulSoup
import httpx

PWD = Path(os.path.dirname(__file__)) / ".."

URL = "https://bulbapedia.bulbagarden.net/wiki/List_of_items_by_index_number_in_Generation_III"
response = httpx.get(URL)
html = response.text

soup = BeautifulSoup(html, 'html.parser')
table = soup.find_all('table')[0]

i = 0
for row in table.find_all('tr')[1:]:
    if i > 0:
        image_cell = row.find_all('td')[2].find('img')
        image_url = image_cell['src']

        padded_id = str(i).zfill(3)
        response = httpx.get(image_url)

        image_path = PWD / "ui" / "public" / "items" / f"{padded_id}.png"
        print(f"writing to %s..." % image_path)
        with open(image_path, "wb") as f:
            f.write(response.content)

    i += 1
