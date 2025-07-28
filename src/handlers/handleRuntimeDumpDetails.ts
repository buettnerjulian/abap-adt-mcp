import { McpError, ErrorCode } from "../lib/utils";
import {
  makeAdtRequest,
  return_error,
  return_response,
  getBaseUrl,
} from "../lib/utils";

interface RuntimeDumpDetailsArgs {
  dump_id: string;
  type?: string; // 'dbAccesses', 'hitlist', 'statements'
}

export async function handleRuntimeDumpDetails(args: RuntimeDumpDetailsArgs) {
  try {
    if (!args?.dump_id) {
      throw new McpError(ErrorCode.InvalidParams, "Dump ID is required");
    }

    let url = `${await getBaseUrl()}/sap/bc/adt/runtime/dumps/${args.dump_id}`;

    // Add type parameter if specified
    if (args.type) {
      url += `/${args.type}`;
    }

    const response = await makeAdtRequest(url, "GET", 30000);
    return return_response(response);
  } catch (error) {
    return return_error(error);
  }
}
