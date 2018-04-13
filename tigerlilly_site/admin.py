from django.contrib import admin
from .models import Author, Post, Issue, Tag, TagsWithPosts, Alias

class TagsWithPostsInline(admin.TabularInline):
    model = TagsWithPosts
    
class PostsInline(admin.TabularInline):
    model = Post
    readonly_fields = ('title', 'alias', 'author')
    exclude = ('article_text',)
    can_delete = False
    extra = 0


class PostAdmin(admin.ModelAdmin):
    fields = ['title', 'alias', 'author', 'issue', 'issue_position', 'article_text']
    inlines = [TagsWithPostsInline]
    list_display = ('title', 'alias', 'issue')
    search_fields = ['article_text', 'title']
    list_filter = ['issue', 'author', 'alias']


class AliasAdmin(admin.ModelAdmin):
    list_display = ('full_name','alias_tagline')  
    
    
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('full_name','admin')    
    list_filter = ['admin']

class IssueAdmin(admin.ModelAdmin):
    inlines = [PostsInline]
    list_display = ('issue_number', 'issue_title', 'current_issue', 'date_published')
    date_hierarchy = 'date_published'
    
    def view_date_published(self, obj):
        return obj.date_published

    view_date_published.empty_value_display = '-'
        
admin.site.empty_value_display = '-empty-'
admin.site.site_header = 'Tigerlilly admin'
admin.site.site_url = 'www.tigerlillyonline.com'

admin.site.register(Post, PostAdmin)    
admin.site.register(Author, AuthorAdmin)
admin.site.register(Alias, AliasAdmin)
admin.site.register(Issue, IssueAdmin)
admin.site.register(Tag)
