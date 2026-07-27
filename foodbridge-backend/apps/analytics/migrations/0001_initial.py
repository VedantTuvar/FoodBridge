import uuid
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
            name='ImpactMetric',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('total_kg_donated', models.DecimalField(decimal_places=2, default=0.0, max_digits=12)),
                ('total_meals_estimated', models.IntegerField(default=0)),
                ('co2_saved_kg', models.DecimalField(decimal_places=2, default=0.0, max_digits=12)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='impact_metric', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
