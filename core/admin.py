from django.contrib import admin
from . import models

# Register your models here.
class MoveAdmin(admin.ModelAdmin):
    pass

class SpeciesAdmin(admin.ModelAdmin):
    pass

class AbilityAdmin(admin.ModelAdmin):
    pass

class ItemAdmin(admin.ModelAdmin):
    pass

admin.register(models.Move, MoveAdmin)
admin.register(models.Species, SpeciesAdmin)
admin.register(models.Ability, AbilityAdmin)
admin.register(models.Item, ItemAdmin)
