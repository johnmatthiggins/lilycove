# Generated by Django 5.0.7 on 2024-08-21 02:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_species_move_pool'),
    ]

    operations = [
        migrations.RenameField(
            model_name='move',
            old_name='move_id',
            new_name='id',
        ),
    ]