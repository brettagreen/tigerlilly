from django.shortcuts import render, get_object_or_404
#from django.http import HttpResponse
from .models import Post

def home(request):
    return render(request, 'tigerlilly_site/home.html', {"posts": Post.objects.all()[:10]})

def detail(request, pk, slugged_title):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'tigerlilly_site/detail.html', {"post":post,"slugged_title":slugged_title})       