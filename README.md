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

Open http://localhost:8000/tasks for the local task list page.

### Importing data

Export the Nieuwe Lijst Der Taken as csv.
Place them in your `home_base` subdirectory, i.e. `home_base/home_base`. Unless
you want to copy this file into your container manually, this is necessary to have
the csv file visible for your docker container.

Run

```
docker compose exec api python manage.py import_csv <path_to_csv>
```

Here, `<path_to_csv>` is the path relative to your _inner_ `home_base` folder.
