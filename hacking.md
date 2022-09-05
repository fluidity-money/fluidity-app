# HACKING

<details>

<summary>Table of Contents</summary>

1. [About](broken-reference)
2. [Prerequisites](broken-reference)
3. [Getting Started](broken-reference)
   * [Lets build ethereum](broken-reference)
   * [Lets build solana](broken-reference)
4. [Web Interfaces](broken-reference)
   * [Ethereum](broken-reference)
   * [Solana](broken-reference)
5. [Backend](broken-reference)
   * [Ethereum](broken-reference)
   * [Solana](broken-reference)
6. [Databases](broken-reference)
   * [Postgres](broken-reference)
   * [Timescales](broken-reference)
7. [Microservices | workers](broken-reference)
8. [Contributing](broken-reference)
9. [Folder Structure](broken-reference)

</details>

## About

This documentation covers every piece of information required to build and contribute to the Fluidity app. This is a closed source repository at the moment and for you to be reading this for the first time right now I'd assume you are new to the project, so welcome to the team :), take a seat while I walk you through the process of conveniently building and understanding how the whole codebase ties up together as an entity.

## Prerequisites

Tools and framworks you need to build this project on your local machine.

* _Unix based OS_ : To build this project successfully you need a Unix based operating system, some of the Make files build configurations were set up for this. you can still follow along with the Windows operating system, but you need to activate and install the Windows based subsystem for Linux [WSL](https://docs.microsoft.com/en-us/windows/wsl/) to follow along.
* [_Go_](https://go.dev/) : Base language environment compiler.
* [_Docker_](https://docs.docker.com/get-docker/) : A set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.
* [_Make_](https://www.gnu.org/software/make/) : This is a tool which controls the generation of executables or binaries and other non-source files of a program from the program's source files.
* [_Rabbitmq_](https://www.rabbitmq.com/download.html) : A message broker that acts as a middleman for various services used for handling message queues.
* [_Node Package Manager_](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) : A tool used for managing JavaScript packages used in the frontend web app interface of the Fluidity Mono application

([back to top](broken-reference))

## Getting Started

The steps and guide here would help you set your project up and running on your local machine.

### _Lets build ethereum_

Building from the back, we need to setup a database and run a migration, and we would use docker images for this, setting up our database on a remote service container. This application uses two forms of databases; regular database setup using [Postgres](https://www.postgresql.org/download/) and a [Timescale](https://docs.timescale.com/install/latest/) database which is an extension of [Postgres](https://www.postgresql.org/download/). An extensive study on what a [Time-series/Time-scale](https://en.wikipedia.org/wiki/TimescaleDB) database is all about.

Shall we begin with the database creation and migration ?. Navigate to `./database/` directory from the parent source directory of the project, by entering the command `cd ./database` from your terminal and then hit enter. you should now be in the `database` directory. Now for the Postgres database we are going to run a `make` command that would do basically 2 things, hoping you have Make installed at this point;

1. Setup a docker container image with our database setup
2. Run a migration on the database creating table schemas.

Now, from your terminal run this command for the migration of a Timescale database:

```
make run-docker-timescale
```

On another terminal Run this for a regular Postgres database

```
make run-docker-postgres
```

At this point you should be having two terminals running, in which both have both established a connection on their default port `5432` and `5433` configurations respectively, thats after the operation of successfully creating a docker image and running a migration. you should get a message similar to this on successful runs. on both terminal.

```
PostgreSQL init process complete; ready for start up.
2022-04-29 17:17:31.020 UTC [1] LOG:  starting PostgreSQL 12.10 on x86_64-pc-linux-musl, compiled by gcc (Alpine 10.3.1_git20211027) 10.3.1 20211027, 64-bit
2022-04-29 17:17:31.020 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2022-04-29 17:17:31.020 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2022-04-29 17:17:31.036 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2022-04-29 17:17:31.120 UTC [85] LOG:  database system was shut down at 2022-04-29 17:17:30 UTC
2022-04-29 17:17:31.141 UTC [1] LOG:  database system is ready to accept connections
```

If you don't successfully get the Postgres database running at this point, then my friend something really freaky is going on or you have probably setup something incorrectly. Also check to make sure both ports `5432` and `5433` were not being used by another service prior to the point where you ran both Postgres commands, if not its sure to fail. After all of these checks and you still don't get the expected results please do not hesistate to contact anyone on the team for help :)

Well, if you successfully get to this point after a succesful migration on the database side of things then congratulations. you are one step closer to completing these intrestingly brutal process of trying to build this repository and running the application locally.

Next step is setting up some environmental variables which should be quite easy. doesn't matter the current directory you are on at the moment make sure [Rabbitmq](https://www.rabbitmq.com/download.html) server is up and running and listening on its default port which should expectedly be `5672` if you don't want it listening on this port or your [Rabbitmq](https://www.rabbitmq.com/download.html) server was not set to listen on this port prior to this guide then all is still fine just watch out for when you need to set the `FLU_AMQP_QUEUE_ADDR` environmental variable, you would need to specify that exact port your [Rabbitmq](https://www.rabbitmq.com/download.html) server is listening on. Now finally run these commands.

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

([back to top](broken-reference))

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
