# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json

from user_agents import parse

from models import Activity, Response

# Create your views here.

def index(request):
	host = request.META['HTTP_HOST'];
	if 'localhost' in host:
		host_name = 'http://'+host+'/'
	else:
		host_name = 'https://'+host+'/'
	user_agent_info = request.META['HTTP_USER_AGENT']
	user_agent = parse(user_agent_info)
	browser = user_agent.browser.family
	device = user_agent.device.family
	os = user_agent.os.family
	ip = get_client_ip(request)
	Activity(ip=ip, browser=browser, device=device, os=os).save()
	if user_agent.is_mobile:
		return render(request, 'form/mobile.html', {'host_name':host_name})
	else:
		return render(request, 'form/static.html', {'host_name':host_name})

@csrf_exempt
def submit_item(request):
	post_data = json.loads(request.body)
	try:
		ip = get_client_ip(request)
		email = post_data['email']
		response = Response.objects.filter(email=email, ip=ip).first()
		if response is None:
			response = Response(email=email, ip=ip)
		items_list = post_data['items_list']
		for item in items_list:
			value = post_data[item]
			setattr(response, item, value)
		response.save()
			
	except (KeyError):
		return HttpResponse(-1)
	return HttpResponse(1)


def get_client_ip(request):
	x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
	if x_forwarded_for:
		print "returning FORWARDED_FOR"
		ip = x_forwarded_for.split(',')[-1].strip()
	elif request.META.get('HTTP_X_REAL_IP'):
		print "returning REAL_IP"
		ip = request.META.get('HTTP_X_REAL_IP')
	else:
		print "returning REMOTE_ADDR"
		ip = request.META.get('REMOTE_ADDR')
	return ip