import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { blue, cyan, greenBright, redBright } from "colorette";

async function runBuildInDirectory(directory) {
    return new Promise((resolve, reject) => {
        exec("npm run build", { cwd: directory }, (error, stdout, stderr) => {
            if (error) {
                console.log(`${redBright("✗")} Error running build in ${directory}: ${error.message}`);
                reject(error);
            }
            if (stderr) {
                console.log(`${redBright("✗")} stderr in ${directory}: ${stderr}`);
            }
            console.log(`${greenBright("✓")} Build complete in ${directory}`);
            console.log(blue(stdout));
            resolve(true);
        });
    });
}

export async function buildResources() {
    const resourcesPath = path.resolve(process.cwd(), "resources");

    if (!fs.existsSync(resourcesPath)) {
        console.log(redBright("✗"), "No 'resources' directory found");
        return;
    }

    const directories = fs
        .readdirSync(resourcesPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(resourcesPath, entry.name));

    if (directories.length === 0) {
        console.log(redBright("✗"), "No subdirectories found in 'resources'");
        return;
    }

    for (const dir of directories) {
        console.log(cyan(`Starting build in ${dir}...`));
        try {
            await runBuildInDirectory(dir);
        } catch (error) {
            console.log(redBright("✗"), `Failed to build in ${dir}`);
        }
    }
}
