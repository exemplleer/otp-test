# OTP Auth

This repository contains the server-side application for user authorization without password using MTS Exolve service

## Requirements

- Node.js v20.9.0 or higher
- PostgresSQL v16 or higher
- [MTS Exolve](https://exolve.ru/) account

## How to install

### 1. Database

Before you start, prepare the application database. The SQL code for creating the database can be found in [`install.sql`](./install.sql)

### 2. Environment

Rename the [`.env.example`](./.env.example) environment file to `.env` and update the variables

### 3. Install dependencies and running

```bash
$ npm install

# start in:
$ npm run start:dev # watch mode
$ npm run start # development
$ npm run start:prod # production mode
```