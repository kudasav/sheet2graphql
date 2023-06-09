# Generated by Django 2.2.26 on 2022-09-25 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20220925_1748'),
    ]

    operations = [
        migrations.AddField(
            model_name='apiuser',
            name='given_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='apiuser',
            name='first_name',
            field=models.CharField(blank=True, default='', max_length=30, verbose_name='first name'),
            preserve_default=False,
        ),
    ]
