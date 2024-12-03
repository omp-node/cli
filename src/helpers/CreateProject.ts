import { devDepsConfig, ompConfig, pkgConfig, tsBaseConfig, tsConfig } from "@/tools";
import { execSync } from "child_process";
import { greenBright } from "colorette";
import { Logger } from "@/tools/Logger";
import { ICliOptions } from "@/types";
import path from "node:path";
import fs from "node:fs";

export class Project {
    public static create(options: ICliOptions) {
        try {
            const { projectName, template, usePaths } = options;

            const projectDirectory = path.join(process.cwd(), projectName);

            this.validateProjectDirectory(projectDirectory);

            this.setupProjectStructure(projectDirectory, template, usePaths);

            this.installDependencies(projectDirectory, template);

            if (template === "ts") this.buildProject(projectDirectory);

            this.formatProject(projectDirectory);

            Logger("success", `Project ${greenBright(projectName)} created at ${projectDirectory}`);
            if (template === "ts") Logger("success", `Run ${greenBright("npm run dev")} to start in development mode`);
        } catch (error) {
            Logger("error", error instanceof Error ? error.message : String(error));
        }
    }

    private static validateProjectDirectory(directory: string) {
        if (fs.existsSync(directory)) {
            throw new Error("Project already exists");
        }
    }

    private static setupProjectStructure(projectDirectory: string, template: string, usePaths: boolean) {
        // Create basic project structure
        fs.mkdirSync(projectDirectory, { recursive: true });
        fs.mkdirSync(path.join(projectDirectory, "src"), { recursive: true });

        // TypeScript-specific setup
        if (template === "ts") this.setupTypeScript(projectDirectory, usePaths);

        // Common project files
        this.createPackageJson(projectDirectory, template);
        this.createOpenmpConfig(projectDirectory, template);
        this.createIndexScripts(projectDirectory, template);
        this.createOmpNodeConfig(projectDirectory, template);
    }

    private static setupTypeScript(projectDirectory: string, usePaths: boolean) {
        // Create TypeScript-specific folders
        fs.mkdirSync(path.join(projectDirectory, "resources"));
        fs.mkdirSync(path.join(projectDirectory, "scripts"));

        // Generate TypeScript configs
        this.writeJsonFile(path.join(projectDirectory, "tsconfig.base.json"), tsBaseConfig);
        this.writeJsonFile(path.join(projectDirectory, "src", "tsconfig.json"), {
            ...tsConfig,
            ...(usePaths && { compilerOptions: { paths: { "@/*": ["./*"] } } }),
        });

        // Copy Rollup config
        this.copyRollupConfig(projectDirectory);
    }

    private static createPackageJson(projectDirectory: string, template: string) {
        const packageJson = {
            ...pkgConfig,
            scripts: {
                ...(pkgConfig.scripts || {}),
                ...(template === "ts" && {
                    dev: "rollup -c ./scripts/rollup.config.mjs -w",
                    build: "rollup -c ./scripts/rollup.config.mjs",
                }),
            },
        };

        this.writeJsonFile(path.join(projectDirectory, "package.json"), packageJson);
    }

    private static createOpenmpConfig(projectDirectory: string, template: string) {
        const omp = {
            ...ompConfig,
            node: { ...ompConfig.node, resources: template === "ts" ? ["resources"] : ["src"] },
        };
        this.writeJsonFile(path.join(projectDirectory, "config.json"), omp);
    }

    private static createOmpNodeConfig(projectDirectory: string, template: string) {
        const dirTemplate = template === "ts" ? "resources" : "src";
        const ompNodeConfig = { name: dirTemplate, entry: "index.js" };
        this.writeJsonFile(path.join(projectDirectory, dirTemplate, "omp-node.json"), ompNodeConfig);
    }

    private static createIndexScripts(projectDirectory: string, template: string) {
        const scriptsPath = path.join(process.cwd(), "src", "templates", "Scripts.ts");
        const scriptsContent = fs.readFileSync(scriptsPath, "utf-8").replace(/\/\/\s?@ts-ignore[^\n]*\n/g, "");
        const extension = template === "ts" ? "ts" : "js";
        fs.writeFileSync(path.join(projectDirectory, "src", `index.${extension}`), scriptsContent);
    }

    private static copyRollupConfig(projectDirectory: string) {
        const rollupConfigSrc = path.join(process.cwd(), "src", "tools", "Rollup.ts");
        const rollupConfigDest = path.join(projectDirectory, "scripts", "rollup.config.mjs");
        fs.copyFileSync(rollupConfigSrc, rollupConfigDest);
    }

    private static writeJsonFile(filePath: string, data: object) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    private static installDependencies(projectDirectory: string, template: string) {
        Logger("success", "Installing dependencies...");

        const dependencies = ["@open.mp/node@latest", "prettier@latest"];
        const devDependencies = Array.isArray(devDepsConfig) ? devDepsConfig : devDepsConfig.split(" ");

        this.executeCommand(`npm install ${dependencies.join(" ")}`, projectDirectory);

        if (devDependencies.length > 0) {
            Logger("success", "Installing development dependencies...");
            this.executeCommand(`npm install --save-dev ${devDependencies.join(" ")}`, projectDirectory);
        }
    }

    private static buildProject(projectDirectory: string) {
        Logger("success", "Building project...");
        this.executeCommand("npm run build", projectDirectory);
    }

    private static formatProject(projectDirectory: string) {
        Logger("success", "Formatting project...");
        this.executeCommand("npm run format", projectDirectory);
    }

    private static executeCommand(command: string, cwd: string) {
        try {
            execSync(command, { cwd, stdio: "ignore" });
        } catch (error) {
            throw new Error(
                `Failed to execute command '${command}': ${error instanceof Error ? error.message : error}`
            );
        }
    }
}
