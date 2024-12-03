import { createPromptUser, Project } from "./helpers";

async function Main() {
    const options = await createPromptUser();
    Project.create(options);
}

Main();
