from django.db import models


class Move(models.Model):
    name = models.CharField(max_length=12)
    effect = models.CharField(max_length=511)
    pp = models.IntegerField()
    power = models.IntegerField()
    accuracy = models.IntegerField()
    move_type = models.CharField(max_length=127)


# TODO: add abilities...
class Species(models.Model):
    name = models.CharField(max_length=127)
    speciesId = models.IntegerField()

    # The ordinal position in the pokedex (Pikachu is #25)
    pokedexId = models.IntegerField()
    type1 = models.CharField(max_length=127)
    type2 = models.CharField(max_length=127)

    # base stats
    hp = models.IntegerField()
    attack = models.IntegerField()
    defense = models.IntegerField()
    speed = models.IntegerField()
    special_attack = models.IntegerField()
    special_defense = models.IntegerField()
