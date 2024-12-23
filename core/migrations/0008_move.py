# Generated by Django 5.0.7 on 2024-08-14 06:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0007_remove_species_move_pool_delete_move"),
    ]

    operations = [
        migrations.CreateModel(
            name="Move",
            fields=[
                ("move_id", models.IntegerField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=12)),
                ("effect", models.CharField(max_length=511)),
                ("pp", models.IntegerField()),
                ("power", models.IntegerField()),
                ("accuracy", models.IntegerField()),
                ("move_type", models.CharField(max_length=127)),
            ],
        ),
    ]
