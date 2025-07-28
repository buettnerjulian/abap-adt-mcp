import { McpError, ErrorCode } from "../lib/utils";
import {
  makeAdtRequest,
  return_error,
  return_response,
  getBaseUrl,
} from "../lib/utils";

// Search → uri extraction → encoding → api releases query approach
export async function handleAPIReleases(args: {
  query: string;
  maxResults?: number;
}) {
  try {
    if (!args?.query) {
      throw new McpError(ErrorCode.InvalidParams, "Query is required");
    }

    const maxResults = args.maxResults || 100;

    // First search for the object to get its URI
    const searchUrl = `${await getBaseUrl()}/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=${encodeURIComponent(
      args.query
    )}&maxResults=1`;
    const searchResponse = await makeAdtRequest(searchUrl, "GET", 30000);

    // Extract URI from search results
    let objectUri = "";
    if (searchResponse.data && typeof searchResponse.data === "string") {
      const uriMatch = searchResponse.data.match(/adtcore:uri="([^"]*)"/);
      if (uriMatch) {
        objectUri = uriMatch[1];
      }
    }

    if (!objectUri) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Could not find object ${args.query}`
      );
    }

    // Encode the URI for API releases query
    const encodedUri = encodeURIComponent(objectUri);
    const apiReleasesUrl = `${await getBaseUrl()}/sap/bc/adt/apireleases?uri=${encodedUri}`;

    const response = await makeAdtRequest(apiReleasesUrl, "GET", 30000);
    return return_response(response);
  } catch (error) {
    return return_error(error);
  }
}
