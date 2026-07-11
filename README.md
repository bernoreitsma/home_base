# Our home base!

This repository should become all kinds of small stuff we can use in our home.
If you come across this, this is quite specific to our home server.

Currently, `tasks` is being actively developed.

## Local setup

Set up local environment variables:

```bash
cp example.env .env
```

Create venv:

```bash
python -m venv venv
```

Activate venv:

```bash
source venv/bin/activate
```

Install requirements
(Make sure your venv is activated! Tip: Check if `which pip` and you should see the
path pointing to a `pip` executable within your venv path.)

```
pip install -r requirements.txt
```

Run dev server:

```
docker compose up -d
```

Run the migrations:

```
docker compose exec api python manage.py migrate
```

Then, open http://localhost:8000/admin for the admin interface.
If you wish to see the container logs, run

```
docker compose logs
```

For further usage, see https://docs.docker.com/compose/.

## Production deploy (homeserver)

The `deploy/` folder holds a self-contained production stack: the Django app
served by gunicorn with `DEBUG` off, static files served by WhiteNoise, and
Postgres on a named volume. The image builds the React bundle itself, so no
manual `npm run build` is needed on the server.

Copy the production env template and fill in real secrets (at minimum
`DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, and `POSTGRES_PASSWORD`):

```
cp deploy/.env.example deploy/.env
```

Then build and start it (from the repo root):

```
docker compose -f deploy/docker-compose.yml up -d --build
```

The entrypoint runs migrations and `collectstatic` on every start, so a new
deploy is just:

```
docker compose -f deploy/docker-compose.yml up -d --build
```

The app listens on port 8000. `deploy/.env` is git-ignored — keep the real
secrets off version control.

# Contribution guide

## Git hooks
Install devtools; run
```
pip install -r requirements-dev.txt
```
Then install the pre-commit hooks, run
```
pre-commit install
```
This takes care of linting, formatting, type-checking etc before you commit.

## Model migrations

If you change or add models, add migrations like so:
To generate code for migrations in Django, run

```
python manage.py makemigrations
```

To migrate the dev db, run

```
docker compose exec api python manage.py migrate
```

## Adding or upgrading dependencies

The dependency management system should automatically handle non-breaking
dependency upgrades.

Add new dependencies in `requirements.in`. Choose a range in which the dependency is
expected to stay compatible.

To upgrade dependencies, update the range beyond the compatible range set in
`requirements.in`.

Then run

```
uv pip compile --generate-hashes requirements.in > requirements.txt
```

Then install them into your local venv:

```
pip install -r requirements.txt
```

and rebuild and run your container:

```
docker compose up -d --build
```

# Frontend

The `tasks` page is a React app (TypeScript) bundled with Vite. The Node
tooling lives in `frontend/`, and Vite builds the bundle straight into `/static`,
where Django's `runserver` serves it.

Install the frontend dependencies (requires Node.js):

```
cd frontend
npm install
```

Build the bundle (one-off):

```
npm run build
```

While developing the frontend, rebuild automatically on every change:

```
npm run dev
```

Then reload http://localhost:8000/tasks.

# The apps

## Tasks

Open http://localhost:8000/tasks for the local task list page. Visit
http://localhost:8000/tasks/dashboard for the dashboard.

### Importing data

Export the Nieuwe Lijst Der Taken (or the example in git) as csv.
Place them in your `home_base` subdirectory, i.e. `home_base/home_base`. Unless
you want to copy this file into your container manually, this is necessary to have
the csv file visible for your docker container.

Run

```
docker compose exec api python manage.py import_csv google_export_example.csv
```

