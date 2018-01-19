from django.contrib import admin
from .models import Author, Post, Tag, TagsWithPosts, Comment

class TagsWithPostsInline(admin.TabularInline):
    model = TagsWithPosts
    extra = 1


class PostAdmin(admin.ModelAdmin):
    fields = ['title', 'author', 'datetime', 'article_text']
    inlines = [TagsWithPostsInline]
    list_display = ('title', 'author', 'datetime')
    search_fields = ['article_text']
    list_filter = ['datetime']


class AuthorAdmin(admin.ModelAdmin):
    list_display = ('full_name','admin')    
    
    
admin.site.register(Post, PostAdmin)    
admin.site.register(Author, AuthorAdmin)
admin.site.register(Tag)
admin.site.register(Comment)
