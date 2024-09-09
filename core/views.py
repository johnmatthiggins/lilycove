from pathlib import Path

from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import Http404
from core.models import Move, Species, Item

def home(_):
    return HttpResponseRedirect("/static/index.html")

def assets(_, path):
    asset_path = Path("/static/assets/") / Path(path)
    print(asset_path)

    return HttpResponseRedirect(str(asset_path))

async def all_moves(_):
    movelist = []
    async for move in Move.objects.all():
        movelist.append(move)

    json_result = "[" + ",".join([str(move) for move in movelist]) + "]"

    return HttpResponse(json_result.encode('utf8'), headers={"Content-Type": "application/json"})

async def all_pokemon(_):
    species = []
    async for pokemon_species in Species.objects.all():
        species.append(await pokemon_species.to_json())

    json_results = ",".join(species)

    return HttpResponse(f"[{json_results}]", headers={"Content-Type": "application/json"})

async def all_items(_):
    items = []
    async for item in Item.objects.all():
        if not "*" in item.name:
            items.append(item)

    json_result = "[" + ",".join([str(item) for item in items]) + "]"

    return HttpResponse(json_result, headers={"Content-Type": "application/json"})

async def pokemon_sprite(_, species_id):
    species_id = species_id.split('.')[0]
    shiny = 's' in species_id
    if shiny:
        species_id = int(species_id[:-1])
    species = await Species.objects.aget(species_id=species_id)
    pokedex_id = str(species.pokedex_id).zfill(3)
    if shiny:
        pokedex_id += 's'

    return HttpResponseRedirect(f"/static/pokemon-images/{pokedex_id}.png")

async def item_sprite(_, item_id):
    return HttpResponseRedirect(f"/static/items/{item_id}")

# TODO: Write method that returns available moves for pokemon species
async def pokemon_moves(_, species_id):
    return Http404()
