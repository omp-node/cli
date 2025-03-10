# @open.mp/cli

`@open.mp/cli` is a command-line interface (CLI) tool for quickly creating and managing resources in your `omp-node` project. It allows you to scaffold new resources and build resources located in the `resources` folder.

## Installation

You can install the CLI globally or run it directly using `npx`.

### Using `npx` (No Installation Required)

To run the CLI tool with `npx`, you can execute the following commands:

```sh
npx omp-node <command> [options]
```

```sh
Commands:
  omp-node add    Create and initialize a new resource for omp-node component
  omp-node build  Iterate through all folders in the 'resources' directory and
                  run 'npm run build' in each

Options:
  --version  Show version number
  --help     Show help
```

### Global Installation (Not necessary, you can just keep using NPX to always have updated package)

To install `@open.mp/cli` globally, run:

```sh
npm install -g @open.mp/cli
```

Then, you can run it directly:

```sh
omp-node <command> [options]
```

## Commands

### `add`

Creates a new resource/package in the `omp-node` project.

**Usage**:

```sh
omp-node add
```

This command will prompt you to select a project template and provide configuration options to create a new resource.

### `build`

Iterates through all folders in the `resources` directory and runs `npm run build` in each one, one by one (not simultaneously). This command is useful for building all resources in the project.

**Usage**:

```sh
omp-node build
```

This command will start the build process for each resource in the `resources` folder, displaying colorful output for each directory processed.
