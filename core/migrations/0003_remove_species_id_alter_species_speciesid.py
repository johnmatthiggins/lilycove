# Generated by Django 5.0.7 on 2024-08-13 01:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_alter_move_id"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="species",
            name="id",
        ),
        migrations.AlterField(
            model_name="species",
            name="speciesId",
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
