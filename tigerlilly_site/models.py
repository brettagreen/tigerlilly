from django.db import models

class Tag(models.Model):
    tag = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.tag
    

class Author(models.Model):
    last = models.CharField(max_length=50)
    first = models.CharField(max_length=50)
    email = models.EmailField(max_length=200)
    admin = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ["last", "first", "email"]
        
    
    def full_name(self):
        return " ".join([self.first, self.last])
    
    
    def __str__(self):
        return self.full_name()


class Post(models.Model):
    article_text = models.TextField(blank=False)
    title = models.TextField()
    datetime = models.DateTimeField(auto_now=False, auto_now_add=False)
    author = models.ForeignKey(Author, null=True, on_delete=models.DO_NOTHING)
    tags = models.ManyToManyField(
        Tag,
        through='TagsWithPosts',
        through_fields=('post', 'tag'))
    
    def get_tags(self):
        return self.tags.all()
    
    def __str__(self):
        return self.title


class Comment(models.Model):
    comment_text = models.TextField(max_length=2000, blank=False)
    datetime = models.DateTimeField(auto_now=False, auto_now_add=False)
    parent_post = models.ForeignKey(Post, on_delete=models.CASCADE)
    
    def __str__(self):
        return 'child of ' +  self.parent_post.title

    
class TagsWithPosts(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    
    def __str__(self):
        return 'tag(s) associated with ' + self.post.title
        
    