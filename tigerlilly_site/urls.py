'''
Created on Jan 6, 2018

@author: Brett
'''
from django.urls import path

from . import views

app_name = 'tigerlilly_site'
#urlpatterns = [
    # ex: /polls/
#    path('', views.index, name='index'),
    # ex: /polls/5/
#    path('<int:question_id>/', views.detail, name='detail'),
    # ex: /polls/5/results/
#    path('<int:question_id>/results/', views.results, name='results'),
    # ex: /polls/5/vote/
#    path('<int:question_id>/vote/', views.vote, name='vote'),
#]

urlpatterns = [
    path('', views.home, name='home'),
    path('<int:post_id>/', views.detail, name='detail')
]