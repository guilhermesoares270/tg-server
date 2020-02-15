# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Install global dependencies
```shell
  yarn global add ganache-cli @adonisjs/cli
```

Install local dependencies
```shell
  yarn
```

Start the local network from cli
```shell
  ganache-cli
```

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

Acess this route to deploy the contract manually
```
  127.0.0.1:3333/api/v1/ganache/deploy
```
