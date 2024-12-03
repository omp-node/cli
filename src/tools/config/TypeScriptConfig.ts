export const tsBaseConfig = {
    exclude: ["node_modules", "resources", "scripts"],
    compileOnSave: true,
    compilerOptions: {
        target: "ES2020",
        module: "ES2020",
        moduleResolution: "Node",
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        baseUrl: ".",
    },
};
export const tsConfig = {
    extends: "../tsconfig.base.json",
    compilerOptions: {
        types: ["@types/node"],
        baseUrl: "./",
    },
    include: ["./**/*.ts"],
};
