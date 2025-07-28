import { McpError, ErrorCode } from "../lib/utils";
import {
  makeAdtRequest,
  return_error,
  return_response,
  getBaseUrl,
} from "../lib/utils";

interface DDICDataElementsArgs {
  object_name: string;
}

export async function handleDDICDataElements(args: DDICDataElementsArgs) {
  try {
    if (!args?.object_name) {
      throw new McpError(ErrorCode.InvalidParams, "Object name is required");
    }

    const encodedObjectName = encodeURIComponent(args.object_name);
    const url = `${await getBaseUrl()}/sap/bc/adt/ddic/dataelements/${encodedObjectName}/source/main`;
    const response = await makeAdtRequest(url, "GET", 30000);

    return return_response(response);
  } catch (error) {
    return return_error(error);
  }
}
