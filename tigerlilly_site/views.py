from django.shortcuts import render, get_object_or_404
#from django.http import HttpResponse
from .models import Post

def home(request):
    page = None
    if request.user_agent.is_mobile:
        page = 'tigerlilly_site/MOBILE_home.html'
    elif request.user_agent.is_tablet:
        page = 'tigerlilly_site/TABLET_home.html'
    else:
        page = 'tigerlilly_site/PC_home.html'
    return render(request, page, {"posts": Post.objects.all()[:12]})

def detail(request, pk, slugged_title):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'tigerlilly_site/detail.html', {"post":post,"slugged_title":slugged_title})       