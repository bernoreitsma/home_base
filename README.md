# Our home base!

All kinds of local server stuff for us to enjoy!

Currently, `tasks` is being actively developed. The app `music` is more of a stub,
really, you can ignore it, we may want to remove it at some point.

## Local setup
Set up local environment variables:
```bash
cp example.env .env
```
Go into the project folder
```
cd home_base
```

Run migrations (currenty we just track the database in sqlite3)
```bash
python manage.py migrate
```
Create admin account
```bash
python manage.py createsuperuser
```
Run the server locally
```bash
python manage.py runserver
```
Then, open http://localhost:8000/admin for the admin interface; 

# Tasks
Open http://localhost:8000/tasks for the local task list page.

## Importing data
Export the Nieuwe Lijst Der Taken as csv. Run
```
python manage.py import_csv <path_to_csv>
```
