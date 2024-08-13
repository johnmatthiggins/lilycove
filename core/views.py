# from django.shortcuts import render
from django.http import HttpResponse
from django.http.response import Http404
from core.models import Move

async def all_moves(_):
    movelist = []
    async for move in Move.objects.all():
        movelist.append(move)

    json_result = "[" + ",".join([str(move) for move in movelist]) + "]"

    return HttpResponse(json_result.encode('utf8'), headers={"Content-Type": "application/json"})

# TODO: Write method that returns available moves for pokemon species
async def pokemon_moves(_, species_id):
    return Http404()
