# -*- coding: utf-8 -*-
SECRET_KEY = "8ls$2fz_un962f26op-*ad)wn2d16l(#)vjjf4+#t@f&n%n$z-"
SERVICE_URL = "http://sso.app"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'seahub_db',
        'USER': 'seafile',
        'PASSWORD': 'c6e3da44-dadf-43eb-8571-7862f4a7b89d',
        'HOST': 'db',
        'PORT': '3306',
        'OPTIONS': {'charset': 'utf8mb4'},
    }
}


CACHES = {
    'default': {
        'BACKEND': 'django_pylibmc.memcached.PyLibMCCache',
        'LOCATION': 'memcached:11211',
    },
    'locmem': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    },
}
COMPRESS_CACHE_BACKEND = 'locmem'
TIME_ZONE = 'Asia/Jakarta'
FILE_SERVER_ROOT = "http://sso.app/seafhttp"
