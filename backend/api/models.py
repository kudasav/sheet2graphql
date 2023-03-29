""" database models """

import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from .user_manager import CustomUserManager

objects = models.Manager()

sources = [
    ('googleSheet', 'googleSheet'),
    ('googleDrive', 'googleDrive'),
    ('file', 'file')
]

class APIUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    secondary_email = models.EmailField(blank=True, null=True)
    given_name = models.CharField(max_length=200, blank=True, null=True)
    family_name = models.CharField(max_length=200, blank=True, null=True)
    full_name = models.CharField(max_length=200)
    lastSeen = models.DateTimeField(auto_now_add=True)
    picture = models.CharField(max_length=200, blank=True, null=True)
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    subscription_id = models.IntegerField(null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

User = APIUser

class Projects(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=200)
    source = models.CharField(max_length=100, choices=sources, default='active')
    spreadsheet_id = models.CharField(max_length=200, blank=True, null=True)
    introspection = models.BooleanField(default=True)
    authentication = models.BooleanField(default=False)
    bearer = models.CharField(max_length=200, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

class Worksheets(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    worksheet_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    project = models.ForeignKey(to=Projects, on_delete=models.CASCADE)
    googlesheets_id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=200)
    create = models.BooleanField(default=False)
    update = models.BooleanField(default=False)
    delete = models.BooleanField(default=False)

class oauthTokens(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.TextField()
    expires = models.DateTimeField()
    refresh_token = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)

class Subscriptions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    renews = models.DateTimeField()
    quota = models.IntegerField()
    card_type = models.CharField(max_length=200, blank=True, null=True)
    card_number = models.IntegerField(null=True)
    update_card_url = models.TextField(blank=True, null=True)
    total_requests = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)