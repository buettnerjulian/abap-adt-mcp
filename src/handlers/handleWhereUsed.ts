import { McpError, ErrorCode, AxiosResponse } from "../lib/utils";
import {
  makeAdtRequest,
  return_error,
  return_response,
  getBaseUrl,
} from "../lib/utils";

interface GetWhereUsedArgs {
  object_name: string;
  object_type?:
    | "CLASS"
    | "INTERFACE"
    | "PROGRAM"
    | "FUNCTION"
    | "TABLE"
    | "STRUCTURE"
    | "REPORT"
    | "INCLUDE"
    | "TYPE"
    | "DOMAIN"
    | "DATA_ELEMENT"
    | "VIEW"
    | "SEARCH_HELP"
    | "LOCK_OBJECT"
    | "TRANSFORMATION"
    | "ENHANCEMENT"
    | "PACKAGE"
    | "TRANSPORT"
    | "FORM"
    | "METHOD"
    | "ATTRIBUTE"
    | "CONSTANT"
    | "VARIABLE"
    | "PARAMETER"
    | "SELECT_OPTION"
    | "FIELD_SYMBOL"
    | "DATA"
    | "CDS_VIEW"
    | "AMDP"
    | "DDIC_OBJECT"
    | "AUTHORIZATION_OBJECT"
    | "NUMBER_RANGE";
  max_results?: number;
}

// Helper function to try ADT Find References API
async function tryFindReferences(
  objectName: string,
  objectType: string,
  maxResults: number
): Promise<{ success: boolean; data: string }> {
  try {
    const baseUrl = await getBaseUrl();

    // Try different Find References API endpoints
    const findReferencesEndpoints = [
      // Standard Find References API
      `${baseUrl}/sap/bc/adt/repository/references?object=${encodeURIComponent(
        objectName
      )}&type=${encodeURIComponent(
        objectType.toLowerCase()
      )}&maxResults=${maxResults}`,
      // Alternative References API
      `${baseUrl}/sap/bc/adt/references/search?query=${encodeURIComponent(
        objectName
      )}&objectType=${encodeURIComponent(objectType)}&maxResults=${maxResults}`,
      // Eclipse-style Find References API
      `${baseUrl}/sap/bc/adt/repository/informationsystem/references?object=${encodeURIComponent(
        objectName
      )}&type=${encodeURIComponent(objectType)}&maxResults=${maxResults}`,
      // Cross-reference API
      `${baseUrl}/sap/bc/adt/repository/crossreference?object=${encodeURIComponent(
        objectName
      )}&objectType=${encodeURIComponent(objectType)}&maxResults=${maxResults}`,
    ];

    for (const endpoint of findReferencesEndpoints) {
      try {
        console.log(`Trying Find References endpoint: ${endpoint}`);
        const response = await makeAdtRequest(endpoint, "GET", 30000);

        if (response.data && typeof response.data === "string") {
          // Check if we got meaningful results
          if (
            response.data.includes("objectReference") ||
            response.data.includes("reference")
          ) {
            const formattedData = formatFindReferencesResponse(
              response.data,
              objectName,
              objectType
            );
            return {
              success: true,
              data: `Find References results for ${objectName} (${objectType}) using ADT API:\n\n${formattedData}`,
            };
          }
        }
      } catch (endpointError: any) {
        console.log(
          `Find References endpoint failed: ${endpoint}`,
          endpointError?.message || "Unknown error"
        );
        continue;
      }
    }

    // Try POST-based Find References API with request body
    try {
      const postEndpoint = `${baseUrl}/sap/bc/adt/repository/references/search`;
      const requestBody = {
        object: objectName,
        objectType: objectType,
        searchType: "ALL_REFERENCES",
        maxResults: maxResults,
      };

      const postResponse = await makeAdtRequest(
        postEndpoint,
        "POST",
        30000,
        JSON.stringify(requestBody)
      );

      if (postResponse.data && typeof postResponse.data === "string") {
        if (
          postResponse.data.includes("objectReference") ||
          postResponse.data.includes("reference")
        ) {
          const formattedData = formatFindReferencesResponse(
            postResponse.data,
            objectName,
            objectType
          );
          return {
            success: true,
            data: `Find References results for ${objectName} (${objectType}) using ADT POST API:\n\n${formattedData}`,
          };
        }
      }
    } catch (postError: any) {
      console.log(
        `POST Find References failed:`,
        postError?.message || "Unknown error"
      );
    }

    return { success: false, data: "" };
  } catch (error: any) {
    console.log(
      `Find References API error:`,
      error?.message || "Unknown error"
    );
    return { success: false, data: "" };
  }
}

// Helper function to format Find References response
function formatFindReferencesResponse(
  responseData: string,
  objectName: string,
  objectType: string
): string {
  try {
    let formattedData = responseData;

    // Parse XML response to extract references
    if (
      responseData.includes("objectReference") ||
      responseData.includes("<reference")
    ) {
      const objectRefs =
        responseData.match(/<[^>]*(?:objectReference|reference)[^>]*>/g) || [];

      if (objectRefs.length > 0) {
        let parsedRefs = `Found ${objectRefs.length} references to ${objectName}:\n\n`;

        objectRefs.forEach((ref, index) => {
          const nameMatch = ref.match(/(?:adtcore:name|name)="([^"]*)"/);
          const typeMatch = ref.match(
            /(?:adtcore:type|type|objectType)="([^"]*)"/
          );
          const packageMatch = ref.match(
            /(?:adtcore:packageName|package)="([^"]*)"/
          );
          const descMatch = ref.match(
            /(?:adtcore:description|description)="([^"]*)"/
          );
          const uriMatch = ref.match(/(?:adtcore:uri|uri)="([^"]*)"/);
          const lineMatch = ref.match(/(?:line|lineNumber)="([^"]*)"/);
          const columnMatch = ref.match(/(?:column|columnNumber)="([^"]*)"/);

          if (nameMatch) {
            parsedRefs += `${index + 1}. ${nameMatch[1]}`;
            if (typeMatch) parsedRefs += ` (${typeMatch[1]})`;
            if (packageMatch) parsedRefs += ` - Package: ${packageMatch[1]}`;
            if (lineMatch) parsedRefs += ` - Line: ${lineMatch[1]}`;
            if (columnMatch) parsedRefs += `, Column: ${columnMatch[1]}`;
            if (descMatch) parsedRefs += `\n   Description: ${descMatch[1]}`;
            parsedRefs += "\n\n";
          }
        });

        formattedData = parsedRefs + "\n--- Raw XML ---\n" + formattedData;
      }
    }

    return formattedData;
  } catch (parseError) {
    console.log("Error parsing Find References response:", parseError);
    return responseData;
  }
}

// Object type mapping for ADT API
function getAdtObjectType(type: string): string {
  const typeMapping: { [key: string]: string } = {
    CLASS: "class",
    INTERFACE: "interface",
    PROGRAM: "program",
    REPORT: "program",
    INCLUDE: "include",
    FUNCTION: "function",
    TABLE: "table",
    STRUCTURE: "structure",
    TYPE: "type",
    DOMAIN: "domain",
    DATA_ELEMENT: "dataelement",
    VIEW: "view",
    CDS_VIEW: "ddlsource",
    SEARCH_HELP: "searchhelp",
    LOCK_OBJECT: "lockobject",
    TRANSFORMATION: "transformation",
    ENHANCEMENT: "enhancement",
    PACKAGE: "package",
    TRANSPORT: "transport",
    AMDP: "amdp",
    DDIC_OBJECT: "ddic",
    AUTHORIZATION_OBJECT: "authorizationobject",
    NUMBER_RANGE: "numberrange",
  };
  return typeMapping[type] || type.toLowerCase();
}

export async function handleGetWhereUsed(args: GetWhereUsedArgs) {
  try {
    if (!args?.object_name) {
      throw new McpError(ErrorCode.InvalidParams, "Object name is required");
    }

    const objectType = args.object_type || "CLASS";
    const maxResults = args.max_results || 100;

    let whereUsedInfo = "";

    // Try ADT Find References API first (most comprehensive)
    try {
      const findReferencesResult = await tryFindReferences(
        args.object_name,
        objectType,
        maxResults
      );
      if (findReferencesResult.success) {
        whereUsedInfo = findReferencesResult.data;
        const response: AxiosResponse = {
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as any,
          data: whereUsedInfo,
        };
        return return_response(response);
      }
    } catch (findReferencesError: any) {
      console.log(
        `Find References API failed for ${args.object_name}:`,
        findReferencesError?.message || findReferencesError
      );
    }

    // Fallback to original Where Used API
    try {
      const adtObjectType = getAdtObjectType(objectType);
      let whereUsedUrl = "";

      // Different API endpoints based on object type
      if (objectType === "TABLE") {
        whereUsedUrl = `${await getBaseUrl()}/sap/bc/adt/ddic/tables/${
          args.object_name
        }/usedby?maxResults=${maxResults}`;
      } else if (["DOMAIN", "DATA_ELEMENT"].includes(objectType)) {
        whereUsedUrl = `${await getBaseUrl()}/sap/bc/adt/ddic/${adtObjectType}s/${
          args.object_name
        }/usedby?maxResults=${maxResults}`;
      } else {
        whereUsedUrl = `${await getBaseUrl()}/sap/bc/adt/repository/whereused/${adtObjectType}/${
          args.object_name
        }?maxResults=${maxResults}`;
      }

      const whereUsedResponse = await makeAdtRequest(
        whereUsedUrl,
        "GET",
        30000
      );

      if (whereUsedResponse.data) {
        let formattedData = whereUsedResponse.data;
        if (
          typeof formattedData === "string" &&
          formattedData.includes("objectReference")
        ) {
          try {
            const objectRefs =
              formattedData.match(/<adtcore:objectReference[^>]*>/g) || [];
            if (objectRefs.length > 0) {
              let parsedRefs =
                "\nFound objects referencing " + args.object_name + ":\n\n";
              objectRefs.forEach((ref, index) => {
                const nameMatch = ref.match(/adtcore:name="([^"]*)"/);
                const typeMatch = ref.match(/adtcore:type="([^"]*)"/);
                const packageMatch = ref.match(/adtcore:packageName="([^"]*)"/);
                const descMatch = ref.match(/adtcore:description="([^"]*)"/);

                if (nameMatch) {
                  parsedRefs += `${index + 1}. ${nameMatch[1]}`;
                  if (typeMatch) parsedRefs += ` (${typeMatch[1]})`;
                  if (packageMatch)
                    parsedRefs += ` - Package: ${packageMatch[1]}`;
                  if (descMatch)
                    parsedRefs += `\n   Description: ${descMatch[1]}`;
                  parsedRefs += "\n\n";
                }
              });
              formattedData = parsedRefs + "\nRaw XML:\n" + formattedData;
            }
          } catch (parseError) {
            // If parsing fails, just use the original data
          }
        }
        whereUsedInfo = `Where Used information for ${args.object_name} (${objectType}):\n${formattedData}`;
      }
    } catch (whereUsedError: any) {
      console.log(
        `Primary Where Used API failed for ${args.object_name}:`,
        whereUsedError?.message || whereUsedError
      );

      // Final fallback: Simple search
      try {
        const simpleSearchUrl = `${await getBaseUrl()}/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=${encodeURIComponent(
          args.object_name
        )}&maxResults=${maxResults}`;
        const simpleSearchResponse = await makeAdtRequest(
          simpleSearchUrl,
          "GET",
          30000
        );
        whereUsedInfo = `Search results for ${args.object_name} (${objectType}):\n\nNote: Where Used APIs not available, showing basic search results.\n\n${simpleSearchResponse.data}`;
      } catch (finalError: any) {
        whereUsedInfo = `Where Used information not available for ${
          args.object_name
        } (${objectType}). 
                
Debug Information:
- Primary API Error: ${whereUsedError?.message || "Unknown error"}
- Final Search Error: ${finalError?.message || "Unknown error"}

Supported object types: 
- Development Objects: CLASS, INTERFACE, PROGRAM, REPORT, INCLUDE, FUNCTION
- Data Dictionary: TABLE, STRUCTURE, TYPE, DOMAIN, DATA_ELEMENT, VIEW, CDS_VIEW
- Other Objects: SEARCH_HELP, LOCK_OBJECT, TRANSFORMATION, ENHANCEMENT, PACKAGE
- Code Elements: FORM, METHOD, ATTRIBUTE, CONSTANT, VARIABLE, PARAMETER
- Advanced: AMDP, AUTHORIZATION_OBJECT, NUMBER_RANGE

Use SAP GUI or ADT Eclipse for detailed Where Used analysis.`;
      }
    }

    const response: AxiosResponse = {
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
      data: whereUsedInfo,
    };

    return return_response(response);
  } catch (error) {
    const fallbackError = new McpError(
      ErrorCode.InternalError,
      `Failed to retrieve Where Used information for ${args.object_name}`
    );

    return return_error(fallbackError);
  }
}
