# Scheduling App

## Authors:

- Sophie Doiron <- Team Lead
- Jared Cassarly
- Shota Nemoto
- Martin Peters

## Installation
Requires Linux/Mac/WSL.

 1. Install nodejs and npm.  (For example, `sudo apt install nodejs`)
 1. Install python3 (`sudo apt install python3`)
 1. Verify pip is installed
 1. Install pipenv
 1. Navigate to `/django/`
 1. run `pipenv shell` (running the python server requires being in this shell)
 1. Navigate to `/share`
 1. Run `./sync_share.sh` and press y
 1. Navigate to `/web`
 1. run `npm install`
 1. run `./builder.sh`
 1. The server should now be running at https://localhost:8000

To run the standalone app without the server, navigate to `/web` and run `npm run`

## Testing

To run javascript tests, navigate to `/web` and run `npm test`

To run python tests, navigate to `/django/gbus` and run `./run_coverage.sh`
