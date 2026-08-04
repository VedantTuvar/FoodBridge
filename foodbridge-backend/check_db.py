import psycopg2
conn = psycopg2.connect(dbname='foodbridge_db', user='foodbridge_admin', password='secretpassword', host='localhost', port='5432')
cur = conn.cursor()
cur.execute("SELECT current_user, current_database(), current_schema();")
print(cur.fetchone())
cur.execute("SELECT n.nspname AS schema_name, pg_catalog.pg_get_userbyid(n.nspowner) AS owner FROM pg_namespace n WHERE n.nspname='public';")
print(cur.fetchone())
cur.close()
conn.close()
