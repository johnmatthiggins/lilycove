"""
URL configuration for lilycove project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

from core.views import all_moves, all_pokemon, all_items, pokemon_moves, pokemon_sprite

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/moves/", all_moves),
    path("api/moves/<int:species_id>", pokemon_moves),
    path("api/species/", all_pokemon),
    path("api/items/", all_items),
    path("api/pokemon-images/<str:species_id>", pokemon_sprite),
]
