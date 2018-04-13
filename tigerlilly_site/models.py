from django.db import models
from django.utils.text import slugify
from collections import OrderedDict

class Alias(models.Model):
    alias_last = models.CharField(max_length=50)
    alias_first = models.CharField(max_length=50)
    alias_tagline = models.CharField(max_length=200, null=True, blank=True)
    alias_bio = models.TextField(null=True, blank=True)
    
    class Meta:
        unique_together = ["alias_last", "alias_first"]
        
    
    def full_name(self):
        return " ".join([self.alias_first, self.alias_last])
    
    
    def __str__(self):
        return self.full_name()

class Issue(models.Model):
    issue_number = models.DecimalField(max_digits=6, decimal_places=2, unique=True)
    issue_title = models.CharField(max_length=500, default='')
    current_issue = models.BooleanField(default=False)
    date_published = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return str(self.issue_number).rstrip('0')
    
    def vol(self):
        return self.write_roman(num=self.issue_number, which="vol")
    
    def iss(self):
        return self.write_roman(num=self.issue_number, which="iss")    

    def write_roman(self, num, which):
        
        iss, vol = str(num).split('.')
        iss = int(iss)
        vol = int(vol)
    
        roman = OrderedDict()
        roman[1000] = "M"
        roman[900] = "CM"
        roman[500] = "D"
        roman[400] = "CD"
        roman[100] = "C"
        roman[90] = "XC"
        roman[50] = "L"
        roman[40] = "XL"
        roman[10] = "X"
        roman[9] = "IX"
        roman[5] = "V"
        roman[4] = "IV"
        roman[1] = "I"
    
        def roman_num(passed_num):
            for r in roman.keys():
                x, y = divmod(passed_num, r)
                yield roman[r] * x
                passed_num -= (r * x)
                if num > 0:
                    roman_num(passed_num)
                else:
                    break
        if which == "vol":
            return "".join([a for a in roman_num(vol)])
        else:
            return "".join([a for a in roman_num(iss)])

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
    article_text = models.TextField(blank=False, null=False)
    title = models.CharField(max_length=500, blank=False, null=False)
    alias = models.ForeignKey(Alias, null=True, blank=True, on_delete=models.SET_NULL)
    author = models.ForeignKey(Author, null=True, blank=True, on_delete=models.DO_NOTHING)
    issue = models.ForeignKey(Issue, null=True, blank=True, on_delete=models.SET_NULL)
    issue_position = models.PositiveSmallIntegerField(null=True, blank=True)
    tags = models.ManyToManyField(
        Tag,
        through='TagsWithPosts',
        through_fields=('post', 'tag'))
    
    def truncate_article_text(self):
        splitvalue = self.article_text.split(' ', 150)
        splitvalue[150] = '<span class="hidden" style="display:none">' + splitvalue[150] + '</span><span class="ellipsis" style="display:inline">...</span><span class="oi oi-chevron-bottom chevron" title="read more" aria-hidden="true"></span>'
        return ' '.join(splitvalue)
        
    def slugged(self):
        if "|" in self.title:
            return slugify(self.title[:self.title.find("|")])
        else:
            return slugify(self.title)
    
    def get_tags(self):
        return self.tags.all()
    
    def __str__(self):
        return self.title
    
    class Meta:
        unique_together = ['issue', 'issue_position']

class TagsWithPosts(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    
    def __str__(self):
        return 'tag(s) associated with ' + self.post.title
        
    