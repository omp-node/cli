export const tsConfig = {
    compileOnSave: true,
    compilerOptions: {
        target: "es2018",
        module: "commonjs",
        moduleResolution: "Node",
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        rootDir: "./",
        outDir: "./resources",
        types: ["@types/node"],
        baseUrl: "./",
    },
    include: ["./**/*.ts"],
};
