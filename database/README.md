
# Databases

Schemas for databases
REQUIRES DBmate for migrations / initialization

## Guidelines to follow

- All folders start with an ID xxx-[Name]. IDs should ONLY consist of numbers!

- Migrations should follow the format of (year . month . date . hour . minute . seconds) . - category . _ . name . .sql

## Creating new Migrations

1. Run the script `create-migration.sh` to create a new migration

2. At the top of the SQL file, write `-- migrate:up`. All subsequent SQL will be performed in 'Up' migrations.

3. At the bottom of the SQL file, write `-- migrate:down`. All subsequent SQL will be performed in 'Down' migrations.

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
