#!/usr/bin/env python3
import sys
import httpx

from bs4 import BeautifulSoup

BASE_URL = 'https://archives.bulbagarden.net/wiki/File:Spr_3r_%s.png'

def main():
    num = int(sys.argv[1])
    padded_num = f'{num:03}'
    webpage_url = BASE_URL % str(padded_num)

    html = get_webpage_html(webpage_url)
    soup = BeautifulSoup(html, features="html.parser")
    result = soup.find(alt=f"File:Spr 3r {padded_num}.png")
    print(result.attrs['src'])


def get_webpage_html(url):
    response = httpx.get(url)
    return response.text

if __name__ == '__main__':
    main()