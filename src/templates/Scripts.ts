// @ts-ignore
import { omp } from "@open.mp/node";

omp.on("resourceStart", () => {
    console.log("omp-node project started");
});
