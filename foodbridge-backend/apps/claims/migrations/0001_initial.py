import uuid
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ('donations', '0001_initial'),
        ('ngos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Claim',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('claimed_at', models.DateTimeField(auto_now_add=True)),
                ('donation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='claim', to='donations.donation')),
                ('ngo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='claims', to='ngos.ngoprofile')),
            ],
        ),
    ]
