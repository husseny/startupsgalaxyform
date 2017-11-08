# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Activity(models.Model):
	ip = models.CharField(max_length=50)
	browser = models.CharField(max_length=50)
	device = models.CharField(max_length=50)
	os = models.CharField(max_length=50)
	time = models.DateTimeField(auto_now_add=True)

class Response(models.Model):
	ip = models.CharField(max_length=50)
	email = models.CharField(max_length=50)
	category = models.CharField(max_length=50)
	country = models.CharField(max_length=50)
	startup_name = models.CharField(max_length=50)
	startup_description = models.CharField(max_length=800)
	startup_website = models.CharField(max_length=50)
	startup_fb = models.CharField(max_length=50)
	startup_tw = models.CharField(max_length=50)
	startup_youtube = models.CharField(max_length=50)
	startup_logo = models.CharField(max_length=50)
	contact_name = models.CharField(max_length=50)
	contact_title = models.CharField(max_length=50)
	contact_number = models.CharField(max_length=50)