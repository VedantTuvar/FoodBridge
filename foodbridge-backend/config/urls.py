from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/donors/', include('apps.donors.urls')),
    path('api/v1/ngos/', include('apps.ngos.urls')),
    path('api/v1/volunteers/', include('apps.volunteers.urls')),
    path('api/v1/donations/', include('apps.donations.urls')),
    path('api/v1/claims/', include('apps.claims.urls')),
    path('api/v1/tasks/', include('apps.tasks.urls')),
    path('api/v1/matching/', include('apps.matching.urls')),
    path('api/v1/ratings/', include('apps.ratings.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/admin-panel/', include('apps.admin_panel.urls')),
    path('api/v1/admin/', include('apps.admin_panel.urls')),

    # OpenAPI Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
