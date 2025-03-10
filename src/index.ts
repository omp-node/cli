import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createPromptUser, Resource } from "./helpers";
import { buildResources } from "./helpers/BuildResources";

yargs(hideBin(process.argv))
    .scriptName("omp-node")
    .usage("Usage: $0 <command> [options]")
    .command(
        "add",
        "Create and initialize a new resource for omp-node component",
        () => {},
        async () => {
            const options = await createPromptUser();
            Resource.create(options);
        }
    )
    .command(
        "build",
        "Iterate through all folders in the 'resources' directory and run 'npm run build' in each",
        () => {},
        async () => {
            await buildResources();
        }
    )
    .demandCommand(1, "You must provide a valid command.")
    .help().argv;
