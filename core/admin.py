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

admin.site.register(models.Move, MoveAdmin)
admin.site.register(models.Species, SpeciesAdmin)
admin.site.register(models.Ability, AbilityAdmin)
admin.site.register(models.Item, ItemAdmin)
