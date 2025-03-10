import tsPaths from "rollup-plugin-tsconfig-paths";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import builtinModules from "builtin-modules";
import jsonPlugin from "@rollup/plugin-json";
import { swc } from "rollup-plugin-swc3";
import jetpack from "fs-jetpack";
import path from "node:path";

const pkgJson = jetpack.read("package.json", "json");
const localInstalledPackages = [...Object.keys(pkgJson.dependencies || {})];
const sourcePath = path.resolve("src");
const buildOutput = "dist";

const resolvePath = (pathParts) => jetpack.path(...pathParts);

export default (() => {
    const outputFile = resolvePath([buildOutput, "index.js"]);

    const external = [...builtinModules, ...localInstalledPackages];

    const tsConfigPath = resolvePath(["tsconfig.json"]);

    return {
        input: resolvePath([sourcePath, "index.ts"]),
        output: {
            file: outputFile,
            format: "es",
            banner: "#!/usr/bin/env node"
        },

        plugins: [
            tsPaths({ tsConfigPath }),
            jsonPlugin(),
            resolve(),
            commonjs(),
            swc({
                tsconfig: tsConfigPath,
                minify: true,
                jsc: {
                    target: "es2019",
                    minify: true,
                    parser: {
                        syntax: "typescript",
                        dynamicImport: true,
                    },
                    externalHelpers: true,
                    keepClassNames: true,
                    loose: true,
                },
            }),
        ],
        external,
    };
})();
