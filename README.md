## USER BIRTHDAY APP (BACKEND)

## SETUP
There's 2 ways to setup this projects
- Local
- Docker


### Local
- Requirements: Node 20.10.0, NPM 10.4.0 or Yarn 1.22.17 (Prefer NPM), Typescript, PostgreeSQL
- Create `.env` file on root project, copy all values from `.env.example`. Adjust the environment variable especially on `POSTGREE_` prefix variable with Your own. Do not forget to create Your database first on Your local Postgre (Can use PGAdmin)
- Run `npm install` to install all packages or library
- Run `npm run dev` to start the project. By default this project will run on 3030 based on PORT from `.env` file.
- If you want to run test. You can simply run `npm run test`. The unit test is using JEST

### Docker
- You must have Docker on Your devices https://www.docker.com/products/docker-desktop/
- Create `.env` file on root project, copy all values from `.env.example`. Adjust the environment variable especially on `POSTGREE_` prefix variable with Your own
- If You already have it. You can just simply run `docker composer up --build`. Then this project will run based on PORT from `.env` file as well as the database

### API Collection
- Using Postman (https://elements.getpostman.com/redirect?entityId=10333524-5cd093a5-b494-4bc6-bd32-16948c82a7ad&entityType=collection)
