import json
from django.db import models


class Move(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=12)
    effect = models.CharField(max_length=511)
    pp = models.IntegerField()
    power = models.IntegerField()
    accuracy = models.IntegerField()
    move_type = models.CharField(max_length=127)

    def to_json(self):
        return f'{{ "id": {self.id}, "name": "{self.name}", "effect": "{self.effect}", "pp": {self.pp}, "power": "{self.power}", "accuracy": "{self.accuracy}", "move_type": "{self.move_type}" }}'

    def __str__(self):
        return f'{{ "id": "{self.id}", "name": "{self.name}", "effect": "{self.effect}", "pp": {self.pp}, "power": "{self.power}", "accuracy": "{self.accuracy}", "move_type": "{self.move_type}" }}'


# TODO: add abilities...
class Species(models.Model):
    species_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=127)

    # The ordinal position in the pokedex (Pikachu is #25)
    pokedex_id = models.IntegerField()
    type1 = models.CharField(max_length=127)
    type2 = models.CharField(max_length=127)

    # base stats
    hp = models.IntegerField()
    attack = models.IntegerField()
    defense = models.IntegerField()
    speed = models.IntegerField()
    special_attack = models.IntegerField()
    special_defense = models.IntegerField()

    # the experience types
    # - slow
    # - medium slow
    # - medium fast
    # - fast
    # - fluctuating
    # - erratic
    growth_rate = models.CharField(max_length=127)

    move_pool = models.ManyToManyField(Move)

    def __str__(self):
        return f'{{ "name": "{self.name}", "species_id": {self.species_id}, "pokedex_id": {self.pokedex_id} }}'

    def to_json(self):
        fields = {
            "name": self.name,
            "species_id": self.species_id,
            "pokedex_id": self.pokedex_id,
            "type1": self.type1,
            "type2": self.type2,
            "stats": {
                "hp": self.hp,
                "attack": self.attack,
                "defense": self.defense,
                "speed": self.speed,
                "special_attack": self.special_attack,
                "special_defense": self.special_defense,
            },
            "abilities": ["Torrent"],
        }

        return json.dumps(fields)

class Ability(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=127)
    species = models.ForeignKey(Species, on_delete=models.CASCADE, related_name='abilities')

    class Meta:
        verbose_name = 'Ability'
        verbose_name_plural = 'Abilities'

class Item(models.Model):
    item_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=127)

    def __str__(self):
        return f'{{ "id": {self.item_id}, "name": "{self.name}" }}'
