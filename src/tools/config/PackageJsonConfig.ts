export const pkgConfig = {
    name: "omp-node-project",
    version: "1.0.0",
    description: "omp-node project",
    type: "module",
    scripts: {
        format: "prettier --write .",
    },
    prettier: {
        singleQuote: true,
        tabWidth: 2,
        printWidth: 80,
    },
};
