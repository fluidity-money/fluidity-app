
# Fluidity Monorepo

## Folder Structure

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
