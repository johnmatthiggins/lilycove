# Generated by Django 5.0.7 on 2024-08-13 05:56

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0003_remove_species_id_alter_species_speciesid"),
    ]

    operations = [
        migrations.RenameField(
            model_name="item",
            old_name="id",
            new_name="item_id",
        ),
        migrations.RenameField(
            model_name="move",
            old_name="id",
            new_name="move_id",
        ),
    ]
