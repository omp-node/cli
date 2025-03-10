import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createPromptUser, Resource } from "./helpers";

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
    .demandCommand(1, "You must provide a valid command.")
    .help().argv;
