import { devDepsConfig, pkgConfig, tsConfig } from "@/tools";
import { execSync } from "child_process";
import { greenBright } from "colorette";
import { Logger } from "@/tools/Logger";
import { ICliOptions } from "@/types";
import path from "node:path";
import fs from "node:fs";

export class Project {
    public static create(options: ICliOptions) {
        try {
            const { resourceName, template, usePaths } = options;

            const resourceDirectory = path.join(process.cwd(), "resources", resourceName);

            this.validateResourceDirectory(resourceDirectory);

            this.setupProjectStructure(resourceName, resourceDirectory, template, usePaths);

            this.installDependencies(resourceDirectory, template);

            if (template === "ts") this.buildProject(resourceDirectory);

            this.formatProject(resourceDirectory);

            Logger("success", `Project ${greenBright(resourceName)} created at ${resourceDirectory}`);
            if (template === "ts") Logger("success", `Run ${greenBright("npm run dev")} to start in development mode`);
        } catch (error) {
            Logger("error", error instanceof Error ? error.message : String(error));
        }
    }

    private static validateResourceDirectory(directory: string) {
        if (fs.existsSync(directory)) {
            throw new Error("Project already exists");
        }
    }

    private static setupProjectStructure(
        resourceName: string,
        resourceDirectory: string,
        template: string,
        usePaths: boolean
    ) {
        // Create basic project structure
        fs.mkdirSync(resourceDirectory, { recursive: true });

        // TypeScript-specific setup
        if (template === "ts") this.setupTypeScript(resourceDirectory, usePaths);

        // Common project files
        this.createPackageJson(resourceDirectory, template);
        this.createIndexScripts(resourceDirectory, template);
        this.createOmpNodeConfig(resourceName, resourceDirectory, template);
    }

    private static setupTypeScript(resourceDirectory: string, usePaths: boolean) {
        // Create TypeScript-specific folders
        fs.mkdirSync(path.join(resourceDirectory, "dist"));

        // Generate TypeScript configs
        this.writeJsonFile(path.join(resourceDirectory, "tsconfig.json"), {
            ...tsConfig,
            compilerOptions: {
                ...tsConfig.compilerOptions,
                outDir: "./dist",
                ...(usePaths && { paths: { "@/*": ["./*"] } }),
            },
            include: ["./**/*.ts", "./*.ts"],
        });
    }

    private static createPackageJson(resourceDirectory: string, template: string) {
        const packageJson = {
            ...pkgConfig,
            scripts: {
                ...(pkgConfig.scripts || {}),
                ...(template === "ts" && {
                    dev: "tsc --watch",
                    build: "tsc",
                }),
            },
        };

        this.writeJsonFile(path.join(resourceDirectory, "package.json"), packageJson);
    }

    private static createOmpNodeConfig(resourceName: string, resourceDirectory: string, template: string) {
        const ompNodeConfig = { name: resourceName, entry: template === "ts" ? "dist/index.js" : "index.js" };
        this.writeJsonFile(path.join(resourceDirectory, "omp-node.json"), ompNodeConfig);
    }

    private static createIndexScripts(resourceDirectory: string, template: string) {
        const scriptsPath = path.join(process.cwd(), "src", "templates", "Scripts.ts");
        const scriptsContent = fs.readFileSync(scriptsPath, "utf-8").replace(/\/\/\s?@ts-ignore[^\n]*\n/g, "");
        const extension = template === "ts" ? "ts" : "js";
        fs.writeFileSync(path.join(resourceDirectory, `index.${extension}`), scriptsContent);
    }

    private static writeJsonFile(filePath: string, data: object) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    private static installDependencies(resourceDirectory: string, template: string) {
        Logger("success", "Installing dependencies...");

        const dependencies = ["@open.mp/node@latest", "prettier@latest"];
        const devDependencies = template === "ts" ? devDepsConfig.split(" ") : [];

        this.executeCommand(`npm install ${dependencies.join(" ")}`, resourceDirectory);

        if (devDependencies.length > 0) {
            Logger("success", "Installing development dependencies...");
            this.executeCommand(`npm install --save-dev ${devDependencies.join(" ")}`, resourceDirectory);
        }
    }

    private static buildProject(resourceDirectory: string) {
        Logger("success", "Building project...");
        this.executeCommand("npm run build", resourceDirectory);
    }

    private static formatProject(resourceDirectory: string) {
        Logger("success", "Formatting project...");
        this.executeCommand("npm run format", resourceDirectory);
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
