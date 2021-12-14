import path from "path";

export function BaseDirectory(): string {
  return path.join(__dirname, "../../");
}
