import { McpError, ErrorCode } from "../lib/utils";
import {
  makeAdtRequest,
  return_error,
  return_response,
  getBaseUrl,
} from "../lib/utils";

interface ABAPTracesDetailsArgs {
  type?: string; // 'dbAccesses', 'hitlist', 'statements'
  id?: string;
}

export async function handleGetABAPTracesDetails(args: ABAPTracesDetailsArgs) {
  try {
    if (!args?.id) {
      throw new McpError(ErrorCode.InvalidParams, "Trace ID is required");
    }

    let url = `${await getBaseUrl()}/sap/bc/adt/runtime/traces/${args.id}`;

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
