import tsPaths from "rollup-plugin-tsconfig-paths";
import builtinModules from "builtin-modules";
import jsonPlugin from "@rollup/plugin-json";
import { swc } from "rollup-plugin-swc3";
import jetpack from "fs-jetpack";
import path from "node:path";

const pkgJson = jetpack.read("package.json", "json");
const localInstalledPackages = [...Object.keys(pkgJson.dependencies || {})];
const sourcePath = path.resolve("src");
const buildOutput = "resources";

const resolvePath = (pathParts) => jetpack.path(...pathParts);

export default (() => {
    const outputFile = resolvePath([buildOutput, "index.js"]);

    const external = [...builtinModules, ...localInstalledPackages];

    const tsConfigPath = resolvePath([sourcePath, "tsconfig.json"]);

    return {
        input: resolvePath([sourcePath, "index.ts"]),
        output: {
            file: outputFile,
            format: "es",
        },

        plugins: [
            tsPaths({ tsConfigPath }),
            jsonPlugin(),
            swc({
                tsconfig: tsConfigPath,
                minify: true,
                jsc: {
                    target: "es2020",
                    externalHelpers: true,
                    keepClassNames: true,
                    loose: true,
                },
            }),
        ],
        external,
        inlineDynamicImports: true,
    };
})();
