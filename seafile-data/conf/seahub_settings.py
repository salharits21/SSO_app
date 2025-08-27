# seahub_settings.py
SECRET_KEY = 'a_super_secret_key_change_it' # Ganti dengan key acak Anda

# Aktifkan backend autentikasi Remote User
AUTHENTICATION_BACKEND = 'seafile.base.accounts.RemoteUserBackend'

# Jika user yang login via SSO belum ada di database Seafile,
# buat user tersebut secara otomatis.
REMOTE_USER_CREATE_UNKNOWN_USER = True