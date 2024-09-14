# Intrinsic Stocks

A web application to track intrinsic long forecast stock information and display it in a user-friendly manner. This project is built with React, TypeScript, and Express, and uses PostgreSQL for the database.

Note: This project simply holds code related to the web-application. To integrate the live process of stock fetching, you can find the code and installation process in my [Stock Fetcher](https://github.com/bgorman87/Stock-Fetcher.git) repository.

## Live Demo

A live version of the site is available at [intrinsic.brandongorman.me](https://intrinsic.brandongorman.me).

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/bgorman87/Intrinsic.git
   cd Intrinsic
2. **Run Docker Compose**

    **Development**
   ```bash
   ./docker-compose-dev.sh
   ```
   This script expects the .env.dev file to be located at project root.

   **Production**
    ```bash
    docker compose up --build -d
    ```
    This expects a .env file at project root

    **Note:** The current project is deployed on a server using Apache as a primary reverse proxy that directs traffic to the Nginx container. This primary reverse proxy also handles SSL. You may need to adjust the Nginx config if you have a different setup.



3. **Initialize Database**

    An initial data dump is provided in the `Database` folder and is attached as a volume to the PostgreSQL server at `/data/init-data.dump`.

    To initialize the database with this data dump, follow these steps:

    1. Find your PostgreSQL container ID by running:

        ```bash
        docker ps
        ```
        Look for the value in the NAMES column.

    2. Execute the following commands, replacing `<postgres_container_id>` with your container ID, and `<username>` and `<database>` with the values from your .env.dev or .env file:
        ```bash
        docker exec -it <postgres_container_id> bash
        pg_restore -U <username> -d <database> /data/init-data.dump
        exit
        ```