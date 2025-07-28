import { McpError, ErrorCode } from "../lib/utils";
import {
  makeAdtRequest,
  return_error,
  return_response,
  getBaseUrl,
} from "../lib/utils";
import { AxiosResponse } from "../lib/utils";

interface ABAPTracesArgs {
  user?: string;
  maxResults?: number;
  objectNameFilter?: string;
}

export async function handleGetABAPTraces(args: ABAPTracesArgs) {
  try {
    const user = args.user || "";
    const maxResults = args.maxResults || 100;
    const objectNameFilter = args.objectNameFilter || "";

    let url = `${await getBaseUrl()}/sap/bc/adt/runtime/traces`;
    const params = new URLSearchParams();

    if (user) {
      params.append("user", user);
    }

    if (maxResults) {
      params.append("maxResults", maxResults.toString());
    }

    if (objectNameFilter) {
      params.append("objectNameFilter", objectNameFilter);
    }

    if (params.toString()) {
      url += "?" + params.toString();
    }

    const adtRes = await makeAdtRequest(url, "GET", 30000);

    // Limit atom entries for better performance
    const { xml, totalCount, displayCount } = limitAtomEntries(
      adtRes.data,
      maxResults,
      objectNameFilter
    );

    // Add MCP info tag
    const mcpInfoTag = `\n<atom:mcp_info>\n  <atom:timeUnit>us</atom:timeUnit>\n  <atom:sizeUnit>byte</atom:sizeUnit>\n  <atom:totalCount>${totalCount}</atom:totalCount>\n  <atom:displayCount>${displayCount}</atom:displayCount>\n</atom:mcp_info>\n`;
    // Insert right after xml header (if no header, insert at the beginning)
    const xmlWithInfo = xml.replace(
      /(<\?xml[^>]*>\s*)?/,
      (m) => m + mcpInfoTag
    );

    // Wrap result in AxiosResponse format
    const response: AxiosResponse = {
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
      data: xmlWithInfo,
    };

    return return_response(response);
  } catch (error: any) {
    return return_error(error);
  }
}

function limitAtomEntries(
  xmlString: string,
  maxCount: number,
  objectNameFilter?: string
): { xml: string; totalCount: number; displayCount: number } {
  try {
    // Find all <atom:entry> elements
    const entryPattern = /<atom:entry[^>]*>[\s\S]*?<\/atom:entry>/g;
    const entries = xmlString.match(entryPattern) || [];

    let filteredEntries: string[] = entries;

    // Apply object name filter if specified
    if (objectNameFilter) {
      filteredEntries = entries.filter((entry) => {
        return entry.toLowerCase().includes(objectNameFilter.toLowerCase());
      });
    }

    const totalCount = filteredEntries.length;
    const displayCount = Math.min(maxCount, filteredEntries.length);
    const limitedEntries = filteredEntries.slice(0, maxCount);

    // Replace all entries with limited entries
    let resultXml = xmlString.replace(entryPattern, "");

    // Find the position to insert entries (after the feed opening tag)
    const feedMatch = resultXml.match(/(<atom:feed[^>]*>)/);
    if (feedMatch) {
      const insertPosition = feedMatch.index! + feedMatch[1].length;
      resultXml =
        resultXml.slice(0, insertPosition) +
        limitedEntries.join("") +
        resultXml.slice(insertPosition);
    }

    return {
      xml: resultXml,
      totalCount,
      displayCount,
    };
  } catch (error) {
    console.error("Error processing XML:", error);
    return {
      xml: xmlString,
      totalCount: 0,
      displayCount: 0,
    };
  }
}
