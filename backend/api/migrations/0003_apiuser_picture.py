# Generated by Django 2.2.26 on 2022-08-21 13:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20220820_2107'),
    ]

    operations = [
        migrations.AddField(
            model_name='apiuser',
            name='picture',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
