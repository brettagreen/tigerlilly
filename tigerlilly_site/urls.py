'''
Created on Jan 6, 2018
@author: Brett
'''
from django.urls import path
from . import views

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

app_name = 'tigerlilly_site'

urlpatterns = [
    path('', views.home, name='home'),
    path('article/<int:pk>/<slug:slugged_title>/', views.detail, name='detail')
]