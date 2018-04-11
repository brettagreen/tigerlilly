from django.shortcuts import render, get_object_or_404
#from django.http import HttpResponse
from .models import Issue, Post

def home(request):
    page = None
    if request.user_agent.is_mobile:
        page = 'tigerlilly_site/MOBILE_home.html'
    elif request.user_agent.is_tablet:
        page = 'tigerlilly_site/TABLET_home.html'
    else:
        page = 'tigerlilly_site/PC_home.html'
    issue_pk = Issue.objects.filter(current_issue=True)
    issue_pk = issue_pk[0]
            
    associated_posts = Post.objects.filter(issue=issue_pk).order_by('issue_position')
    for post in associated_posts:
        if post.article_text.count(' ') > 150:
            post.article_text = post.truncate_article_text()
            
    return render(request, page, {"issue": issue_pk, "posts": associated_posts})


def detail(request, pk, slugged_title):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'tigerlilly_site/detail.html', {"post":post,"slugged_title":slugged_title})       