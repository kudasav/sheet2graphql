# Generated by Django 2.2.26 on 2022-08-20 19:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='oauthtokens',
            old_name='expires_in',
            new_name='expires',
        ),
    ]
