import {
  makeAdtRequest,
  getBaseUrl,
  McpError,
  return_error,
  return_response,
  ErrorCode,
} from "../lib/utils";
import { AxiosResponse } from "../lib/utils";

// Runtime dump list query parameter types
export interface RuntimeDumpsArgs {
  start_date?: string; // YYYY-MM-DD or YYYYMMDD format
  end_date?: string; // YYYY-MM-DD or YYYYMMDD format
  start_time?: string; // 00:00:00 or 000000 default 000000
  end_time?: string; // 00:00:00 or 000000 default 235959
  category?: string; // optional
  maxResults?: number;
}

export async function handleRuntimeDumps(args: RuntimeDumpsArgs): Promise<any> {
  try {
    // Parameter defaults and normalization
    const startDate = args.start_date
      ? args.start_date.replace(/-/g, "")
      : new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let endDate =
      typeof args.end_date === "string" && args.end_date.trim() !== ""
        ? args.end_date.replace(/-/g, "")
        : startDate;
    const startTime = args.start_time
      ? args.start_time.replace(/:/g, "")
      : "000000";
    const endTime = args.end_time ? args.end_time.replace(/:/g, "") : "235959";
    const category = args.category;
    let maxResults = args.maxResults ?? 1;
    let trimmedNotice = "";
    if (maxResults > 5) {
      trimmedNotice =
        "Requested maxResults exceeded 5, limited to 5 results and remaining were trimmed.";
      maxResults = 5;
    }

    // from, to format generation
    const from = `${startDate}${startTime}`;
    const to = `${endDate}${endTime}`;

    // SAP ADT API call
    const requestUrl = `${await getBaseUrl()}/sap/bc/adt/runtime/dumps?from=${from}&to=${to}`;
    const adtRes = await makeAdtRequest(requestUrl, "GET", 30000);
    let xml = adtRes.data;

    // Limit <atom:entry> elements count and category filtering
    const limited = limitAtomEntriesWithCategory(xml, maxResults, category);
    const totalCount = limited.totalCount;
    const displayCount = limited.displayCount;
    xml = limited.xml;

    // Insert <atom:mcp_info> tag at the top of xml
    const mcpInfoTag = `\n<atom:mcp_info>\n  <atom:timeUnit>us</atom:timeUnit>\n  <atom:sizeUnit>byte</atom:sizeUnit>\n  <atom:totalCount>${totalCount}</atom:totalCount>\n  <atom:displayCount>${displayCount}</atom:displayCount>\n</atom:mcp_info>\n`;
    // Insert right after xml header (if no header, insert at the beginning)
    const xmlWithInfo = xml.replace(
      /(<\?xml[^>]*>\s*)?/,
      (m) => m + mcpInfoTag
    );

    // Wrap result in AxiosResponse format (utilizing ADT response values)
    const response: AxiosResponse = {
      status: adtRes.status,
      statusText: adtRes.statusText,
      headers: adtRes.headers,
      config: adtRes.config,
      data: xmlWithInfo,
    };
    return return_response(response);
  } catch (error: any) {
    return return_error(error);
  }
}

function limitAtomEntriesWithCategory(
  xmlString: string,
  maxCount: number,
  category?: string
): { xml: string; totalCount: number; displayCount: number } {
  try {
    // Find all <atom:entry> elements
    const entryPattern = /<atom:entry[^>]*>[\s\S]*?<\/atom:entry>/g;
    const entries = xmlString.match(entryPattern) || [];

    let filteredEntries: string[] = entries;

    // Apply category filter if specified
    if (category) {
      filteredEntries = entries.filter((entry) => {
        // Look for category information in the entry
        return entry.toLowerCase().includes(category.toLowerCase());
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
