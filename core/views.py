from pathlib import Path

from django.views.decorators.cache import cache_page
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import Http404
from core.models import Move, Species, Item

def home(_):
    return HttpResponseRedirect("/static/index.html")

def assets(_, path):
    asset_path = Path("/static/assets/") / Path(path)
    return HttpResponseRedirect(str(asset_path))

@cache_page(60)
async def all_moves(_):
    movelist = []
    async for move in Move.objects.all():
        movelist.append(move)

    json_result = "[" + ",".join([str(move) for move in movelist]) + "]"

    return HttpResponse(
        json_result.encode('utf8'),
        headers={
            "Content-Type": "application/json",
            # cache content for a week
            "Cache-Control": "max-age=604800",
        }
    )

@cache_page(60)
async def all_pokemon(_):
    species = []
    async for pokemon_species in Species.objects.all():
        species.append(await pokemon_species.to_json())

    json_results = ",".join(species)

    return HttpResponse(
        f"[{json_results}]",
        headers={
            "Content-Type": "application/json",
            # cache content for a week
            "Cache-Control": "max-age=604800",
        }
    )

@cache_page(60)
async def all_items(_):
    items = []
    async for item in Item.objects.all():
        if not "*" in item.name:
            items.append(item)

    json_result = "[" + ",".join([str(item) for item in items]) + "]"

    return HttpResponse(
        json_result,
        headers={
            "Content-Type": "application/json",
            # cache content for a week
            "Cache-Control": "max-age=604800",
        }
    )

# TODO: Write method that returns available moves for pokemon species
async def pokemon_moves(_, species_id):
    return Http404()
