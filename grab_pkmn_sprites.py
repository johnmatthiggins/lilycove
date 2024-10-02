#!/usr/bin/env python3
import os
import httpx

from bs4 import BeautifulSoup

def main():
    if not os.path.isdir('ui/public/pokemon-images/'):
        os.mkdir('ui/public/pokemon-images/')

    fstring = 'ui/public/pokemon-images/%s.png'

    # get non-shiny images
    for i in range(1, 386 + 1):
        path = fstring % (f'{i:03}')

        download_image(i, path)

        path = fstring % (f'{i:03}s')

        download_image(i, path, shiny=True)

def download_image(id, path, shiny=False):
    if shiny:
        BASE_URL = "https://archives.bulbagarden.net/wiki/File:Spr_3r_%s_s.png"
    else:
        BASE_URL = "https://archives.bulbagarden.net/wiki/File:Spr_3r_%s.png"

    padded_num = f"{id:03}"
    webpage_url = BASE_URL % str(padded_num)

    html = get_webpage_html(webpage_url)
    soup = BeautifulSoup(html, features="html.parser")
    if shiny:
        archive_file_name = f"Spr 3r {padded_num} s.png"
    else:
        archive_file_name = f"Spr 3r {padded_num}.png"

    result = soup.find(alt=f"File:{archive_file_name}")
    image_url = result.attrs["src"]

    response = httpx.get(image_url)
    print('writing image from %s...' %(image_url))
    with open(path, "wb") as f:
        f.write(response.content)

def get_webpage_html(url):
    response = httpx.get(url)
    return response.text


if __name__ == "__main__":
    main()
