sudo -u postgres psql -d sasloop_db -t -A -c "SELECT staff_permissions->'pos_access'->'OrderWindow'->'item_categories' FROM app_users WHERE username = 'shahetehzeebpos';"
