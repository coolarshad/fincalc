import os
from .base import *

DEBUG = False

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-4)xx#e^0#wlo%m$0d#e^-3@v#s(#tjp!#&7dng-tnrdcswgnv7"
)

ALLOWED_HOSTS = [
    'financetoolslab.com',
    'www.financetoolslab.com',
    'financetoollab.com',
    'www.financetoollab.com',
    'localhost',
    '127.0.0.1',
]

# Allow overriding/extending ALLOWED_HOSTS from environment variable
env_hosts = os.getenv('ALLOWED_HOSTS')
if env_hosts:
    ALLOWED_HOSTS.extend([h.strip() for h in env_hosts.split(',') if h.strip()])

CSRF_TRUSTED_ORIGINS = [
    'https://financetoolslab.com',
    'https://www.financetoolslab.com',
    'https://financetoollab.com',
    'https://www.financetoollab.com',
    'http://localhost',
    'http://127.0.0.1',
]

WAGTAILADMIN_BASE_URL = 'https://financetoolslab.com'

try:
    from .local import *
except ImportError:
    pass
