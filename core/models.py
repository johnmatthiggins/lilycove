from django.db import models


class Move(models.Model):
    move_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=12)
    effect = models.CharField(max_length=511)
    pp = models.IntegerField()
    power = models.IntegerField()
    accuracy = models.IntegerField()
    move_type = models.CharField(max_length=127)

    def to_json(self):
        return f'{{ "id": {self.move_id}, "name": "{self.name}", "effect": "{self.effect}", "pp": {self.pp}, "power": "{self.power}", "accuracy": "{self.accuracy}", "move_type": "{self.move_type}" }}'

    def __str__(self):
        return f'{{ "id": "{self.move_id}", "name": "{self.name}", "effect": "{self.effect}", "pp": {self.pp}, "power": "{self.power}", "accuracy": "{self.accuracy}", "move_type": "{self.move_type}" }}'


# TODO: add abilities...
class Species(models.Model):
    name = models.CharField(max_length=127)
    speciesId = models.IntegerField(primary_key=True)

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


class Item(models.Model):
    item_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=127)

    def __str__(self):
        return f'{{ "id": {self.item_id}, "name": "{self.name}" }}'
