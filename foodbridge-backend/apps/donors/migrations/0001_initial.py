import uuid
import django.contrib.gis.db.models.fields
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DonorProfile',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('organization_name', models.CharField(max_length=255)),
                ('donor_type', models.CharField(choices=[('restaurant', 'Restaurant'), ('hotel', 'Hotel'), ('grocery', 'Grocery Store'), ('individual', 'Individual'), ('event', 'Event Host'), ('corporate', 'Corporate')], default='restaurant', max_length=30)),
                ('address', models.TextField()),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('rating_avg', models.DecimalField(decimal_places=2, default=5.0, max_digits=3)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='donor_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
