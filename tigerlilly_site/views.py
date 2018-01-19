from django.shortcuts import render, get_object_or_404
#from django.http import HttpResponse
from .models import *

def home(request):
    return render(request, 'tigerlilly_site/home.html', {"posts": Post.objects.all()})

def detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    return render(request, 'tigerlilly_site/detail.html', {"post" : post})