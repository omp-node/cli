// @ts-ignore
import { omp } from "@omp-node/core";

omp.on("resourceStart", () => {
    console.log("omp-node resource started");
});
