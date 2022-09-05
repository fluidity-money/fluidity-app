# ⌨ HACKING

## TODO

## Prerequisites

* _Unix based OS/Windows subsystem for Linux :_ we use `make` extensively throughout the codebase
* [_Go_](https://go.dev/) : Go 1.17 language compiler
* [_Docker_](https://docs.docker.com/get-docker/) : A set of platform as a service products that use OS-level virtualization to deliver software in packages called containers
* [_Make_](https://www.gnu.org/software/make/) : This is a tool which controls the generation of executables or binaries and other non-source files of a program from the program's source files
* [_Rabbitmq_](https://www.rabbitmq.com/download.html) : A message broker that acts as a middleman for various services used for handling message queues
* [_Node Package Manager_](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) : A tool used for managing JavaScript packages used in the frontend web app interface of the Fluidity Mono application

## Getting Started

The steps and guide here would help you set your project up and running on your local machine.

### Running the databases

We need to:

* Setup the Postgres/Timescale database
* Set up Docker

This application uses two forms of databases; regular database setup using [Postgres](https://www.postgresql.org/download/) and a [Timescale](https://docs.timescale.com/install/latest/) database which is an extension of [Postgres](https://www.postgresql.org/download/). Read here for more: what is a [Time-series/Time-scale](https://en.wikipedia.org/wiki/TimescaleDB) database

Navigate to `./database` directory from the parent source directory of the project and run the Makescript `run-docker-timescale` to start Timescale:

```
cd database
make run-docker-timescale
```

Postgres is very similar, in another terminal (also in the directory `database`):

```
make run-docker-postgres
```

This makefile does the following:

1. Creates a Docker container based off `timescale/timescaledb:latest-pg12` or `postgres:14.0-alpine`&#x20;
2. Grabs `curl` and [`dbmate`](https://github.com/amacneil/dbmate)``
3. Uses `dbmate` to execute the database migrations in `database/timescale` or `database/postgres` following building the compiled migrations with `make timescale` or `make postgres`

`make run-docker-timescale` listens on `::5433`. `make run-docker-postgres` listens on `5432.`

```
PostgreSQL init process complete; ready for start up.
2022-04-29 17:17:31.020 UTC [1] LOG:  starting PostgreSQL 12.10 on x86_64-pc-linux-musl, compiled by gcc (Alpine 10.3.1_git20211027) 10.3.1 20211027, 64-bit
2022-04-29 17:17:31.020 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2022-04-29 17:17:31.020 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2022-04-29 17:17:31.036 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2022-04-29 17:17:31.120 UTC [85] LOG:  database system was shut down at 2022-04-29 17:17:30 UTC
2022-04-29 17:17:31.141 UTC [1] LOG:  database system is ready to accept connections
```

Check to make sure both ports `5432` and `5433` were not being used by another service prior to the point where you ran both Postgres commands, if not its sure to fail.&#x20;

### Running RabbitMQ

Running RabbitMQ is easy:

```
docker run -p 5672:5672 rabbitmq:3.9.13
```

Using Docker, this starts RabbitMQ, the message broker used internally.

### Building Ethereum microservices

`FLU_AMQP_QUEUE_ADDR` environmental variable, you would need to specify that exact port your [Rabbitmq](https://www.rabbitmq.com/download.html) server is listening on. Now finally run these commands.

```
export FLU_TIMESCALE_URI=postgres://fluidity:fluidity@localhost:5433?sslmode=disable FLU_POSTGRES_URI=postgres://fluidity:fluidity@localhost?sslmode=disable FLU_WORKER_ID=ethereum.fluidity.money-backend
```

Wait!, we are not done yet remember when i talked about setting `FLU_AMQP_QUEUE_ADDR` up ?, which would depend on how you setup your [Rabbitmq](https://www.rabbitmq.com/download.html) server, well the moment of truth has arrived. at this point if your Rabbitmq server listens at its default port prior to its installation whcich is `5672` then you are all good to go just run this command

```
export FLU_AMQP_QUEUE_ADDR=amqp://localhost
```

Yeah that's it :). but if your Rabbitmq server by default doesn't listen on port `5672` for some really weird reasons or you went all "I got this, i know what i'm doing" on it, then you'd need to specify the port you set it to listen to while setting up your `FLU_AMQP_QUEUE_ADDR` environment variable. something like this woud do

```
export FLU_AMQP_QUEUE_ADDR=amqp://localhost:$port_number
```

Note that $port\_number being your specified port in which Rabbitmq is currently listening on.

We have one more environmental variable to set before we run build. its and API address used to locate the backend service where all of the magic is done and served to the frontend web application. run the command

```
export FLU_WEB_LISTEN_ADDR=[127.0.0.1]:8080
```

and finally from your parent source directory of the project navigate to `/web/ethereum.fluidity.money/` Its time to build the backend service and generate some sort of binaries from it and then run the binary which keeps our backend services open to requests.

Now at this point run the command;

```
make backend
```

then a binary called `ethereum.fluidity.money.out` is generated. and finally run this command;

```
./ethereum.fluidity.money.out
```

If you wait for at least 30secs and you don't see any error message, then you are good to go!

Now Lets build the frontend web applicaton now that we have our server running and open to both `http` and `ws` connections. hopefully if you went through the brual process of building the backend this should be Ez :).

On another terminal navigate to `/web/ethereum.fluidity.money/` from the parent source directory of the project. all you need to do is make sure you have `NPM` installed then run the command `npm install` which should get all of its dependencies refrenced in the `package.json` file on your current directory. then run the command `make frontend`. and VOILÀ!, you should see a prompt that says `Creating an optimized production build...`. when sucessfully built you should you should be all set and webapp should by default be hosted on port `3000` when you visit `http://localhost:3000/` from your browser.

_Note_: At this point your frontend service is connected to a local backend service running a database you just created so you would not find so much to do. you could refer to the Database section on this guide where i show how to get some data into the database, so you get some visual data outputs on the fronetend web application. but if you don't have time to do this you could connect the frontend application to a backend service that has already been deployed and should definitely contain every database data you'd need to work with. To do this you'd first need to kill the process you are currently running by hitting `CTRL + c` on your terminal where you built the frontend and enter this command:

```
export REACT_APP_API_URL=https://ropsten.beta.fluidity.money:8081 REACT_APP_WALLET_CONNECT_GETH_URI=wss://ropsten.beta.fluidity.money:8081 REACT_APP_WEBSOCKET=wss://ropsten.beta.fluidity.money:8081/update
```

As you can see at this point we are connecting to an already deployed version of our backend service. now build the web application again running `make frontend` and you'd see some bunch of data to play around with :)

([back to top](broken-reference/))

## Folder Structure

```
.
| build.mk - Build aliases
| Dockerfile - Dockerise micro-services
| Dockerfile.web - Dockerise web services
| golang.mk - Build scripts (Go)
| Makefile - Build scripts
| out - Log file
| web.mk - Build scripts (Web)
| WORKER_ARCHITECTURE.md
|-- automation
|   |-- Buncha docker composes
|-- cmd
|   |-- Microservices
|-- common
|   |-- Utility functions
|-- contracts
|   |-- Smart contracts
|-- database
|   |-- Database migrations and schema
|-- lib
|   |-- Common library functions
|-- scripts
|   |-- docker-compose-all.sh   - Builds everything in docker container
|   |-- Testing scripts
|-- web
|   |-- Web
|-- worker
    |-- Build folder for worker
```
