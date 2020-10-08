<h1 align="center">Hold'em Hounds</h1>

<p align="center">
  <a href="https://codeclimate.com/github/timhaley94/holdem/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/b4b31a8f8cf13a23ca93/maintainability" />
  </a>
  <a href="https://codeclimate.com/github/timhaley94/holdem/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/b4b31a8f8cf13a23ca93/test_coverage" />
  </a>
  <a href="https://circleci.com/gh/timhaley94/holdem">
    <img src="https://circleci.com/gh/timhaley94/holdem.svg?style=shield" />
  </a>
</p>

Born of the pandemic, Hold'em Hounds is an (🚧 in development 🚧) poker app that's aiming to
bring a fresh perspective to a crowded field of garish, clunky apps, desparate to suck you
into microtransactions.

## Product priorities

Hold'em Hounds should be...

- Multiplayer
- Free to play
- Real time
- Account optional
- Download optional
- Not too serious
- Beautiful

## Directory structure

```
holdem/
  .circleci/        --> CI/CD configuration
  client/           --> Client (React) code
  infrastructure/   --> Infrastructure (Terraform) code
  server/           --> Server (Node.js) code
```

## Development

While you you could set up each individual piece of the system locally (i.e. server, client, redis)
the easiest way to run the project is through `docker-compose`. Make sure you have `docker` and
`docker-compose` installed and then you can run `docker-compose up` in the root directory.

Viola, [http:localhost:3000](http:localhost:3000).

The `docker-compose` configuration supports hot reloading, so once you have it running, your
changes to `./client` and `./server` will be respected. However, if you ever need to force a
rebuild: `docker-compose build`.

### Run as a distributed system

```sh
docker-compose up --scale server=2
```

### Run without logs

```sh
docker-compose up -d
```

### Bring system down

```sh
docker-compose down
```

### High level docs

We have a couple of diagrams to get a high level feel for the implementation:
- [Our technical stack](docs/diagrams/the_stack.png)
- [Our infrastructure](docs/diagrams/infrastructure.png)

## Contributing

1. Read [our contributing guide](docs/CONTRIBUTING.md)
2. Find a Github issues
3. Fork this repository (if you aren't a collaborator)
4. Open a pull request
