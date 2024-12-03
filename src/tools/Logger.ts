import { greenBright, redBright } from "colorette";

export function Logger(type: "success" | "error", message: string) {
    console.log(type === "success" ? greenBright("✓") : redBright("✗"), message);
}
