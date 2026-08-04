from .base import *

DEBUG = False
SECRET_KEY = 'test-secret-key'

# Keep GIS support enabled so the app's spatial models can be tested properly.
INSTALLED_APPS = INSTALLED_APPS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'foodbridge_db',
        'USER': 'foodbridge_admin',
        'PASSWORD': 'secretpassword',
        'HOST': '127.0.0.1',
        'PORT': '5433',
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
