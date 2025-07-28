import { McpError } from "./utils";
import { return_error } from "./utils";

export function handleMcpError(error: any) {
  if (error instanceof McpError) {
    return return_error({ code: error.code, message: error.message });
  }
  if (error && typeof error === "object") {
    const code = typeof error.code === "string" ? error.code : "INTERNAL_ERROR";
    const message =
      typeof error.message === "string"
        ? error.message
        : "Unknown error occurred.";
    return return_error({ code, message });
  }
  return return_error({ code: "INTERNAL_ERROR", message: String(error) });
}
