import { McpError, ErrorCode } from "../lib/utils";
import {
  makeAdtRequest,
  return_error,
  return_response,
  getBaseUrl,
} from "../lib/utils";

interface MessageClassArgs {
  MessageClass: string;
}

export async function handleGetMessageClass(args: MessageClassArgs) {
  try {
    const messageClass = args?.MessageClass;
    if (!messageClass) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Message Class name is required"
      );
    }

    const url = `${await getBaseUrl()}/sap/bc/adt/messageclass/${messageClass}`;
    const response = await makeAdtRequest(url, "GET", 30000);

    return return_response(response);
  } catch (error) {
    return return_error(error);
  }
}
