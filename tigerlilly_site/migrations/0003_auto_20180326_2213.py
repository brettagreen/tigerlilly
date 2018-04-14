import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tigerlilly_site', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('issue_number', models.DecimalField(decimal_places=2, max_digits=6, unique=True)),
                ('issue_title', models.CharField(max_length=500, null=True)),
                ('date_published', models.DateField(default=datetime.date(2018, 3, 26), null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='post',
            name='datetime',
        ),
        migrations.AddField(
            model_name='post',
            name='issue',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='tigerlilly_site.Issue'),
        ),
    ]
