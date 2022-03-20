
# Databases

Schemas for databases
REQUIRES DBmate for migrations / initialization

## Guidelines to follow

- All files/folders start with an ID xxx-[Name]. IDs should ONLY consist of numbers!

- Folder names should start with 1xx

- File names should start with 0xx

- Order DOES matter. Please don't go and mess with the order of the existing SQL files (Unless you know what you're doing!)

- All names should have a unique xxx identifier. DBmate will not run/find files with duplicate identifiers

## Creating new Migrations

1. Find/Create your SQL directory.

2. Create a new SQL file. This should begin with the next available xxx identifier in the directory

3. At the top of the SQL file, write `-- migrate:up`. All subsequent SQL will be performed in 'Up' migrations.

4. At the bottom of the SQL file, write `-- migrate:down`. All subsequent SQL will be performed in 'Down' migrations.

## Creating a new DB

### Docker-Compose

`docker-compose -f automation/docker-compose.infrastructure.yml`

### Docker

`make run-docker-[timescale/postgres]`

### Locally

1. Start Postgres: `sudo systemctl start postgresql`

2. Download DBmate binary

3. Make DB migration folders: `make [timescale/postgres]`

3. Run up-migrate: `dbmate -u [PG_URL] -d build/[timescale/postgres] up`

4. Connect to PG and test

