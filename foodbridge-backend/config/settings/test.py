from .base import *

DEBUG = False
SECRET_KEY = 'test-secret-key'

# Remove daphne and GIS apps for in-memory SQLite testing environment
INSTALLED_APPS = [
    app for app in INSTALLED_APPS 
    if app not in ['daphne', 'django.contrib.gis', 'rest_framework_gis']
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

CELERY_TASK_ALWAYS_EAGER = True
