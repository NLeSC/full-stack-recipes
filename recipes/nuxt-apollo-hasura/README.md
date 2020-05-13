# Nuxt Apollo Hasura Example

Requirements locally: docker and Yarn. 

## Setup

1. Create a Firebae project and write the config values on the `.env` file. 
2. First create an `.env` file following `.env.example`.
3. Add the necessary tables to the database like describe inside the application itself. `localhost:3000/crud`


```bash

# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```

Setup database schema and data
```
$ npx hasura migrate apply
```

```
# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
