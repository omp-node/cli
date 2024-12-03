import { ICliOptions } from "@/types";
import inquirer from "inquirer";

export async function createPromptUser(): Promise<ICliOptions> {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: `Enter the project name:`,
            default: "omp-node-project",
        },
        {
            type: "list",
            name: "template",
            message: `What template would you like to create?`,
            choices: [
                {
                    name: "TypeScript",
                    value: "ts",
                },
                {
                    name: "JavaScript",
                    value: "js",
                },
            ],
        },
        {
            type: "confirm",
            name: "usePaths",
            message: `Would you like to use path aliases (@/*)?`,
            when: (answer) => answer.template === "ts",
        },
    ]);

    return answers as ICliOptions;
}
