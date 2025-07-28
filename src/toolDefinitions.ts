import * as handlers from "./handlers/index";

// All tool definitions with improved structure
export const toolDefinitions = [
  // API_Releases
  {
    name: "API_Releases",
    description: "Retrieve API Release information for an ADT object",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "ADT object search query (e.g. SBOOK, C_GREGORIANCALSGLDATEFUNCVH)",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of results to return",
          default: 100,
        },
      },
      required: ["query"],
    },
    handler: handlers.handleAPIReleases.handleAPIReleases,
  },

  // DataPreview
  {
    name: "DataPreview",
    description: "Preview ABAP data for a DDIC entity",
    inputSchema: {
      type: "object",
      properties: {
        ddicEntityName: {
          type: "string",
          description: "DDIC entity name",
        },
        rowNumber: {
          type: "number",
          description: "Number of rows to retrieve",
          default: 100,
        },
      },
      required: ["ddicEntityName"],
    },
    handler: handlers.handleDataPreview.handleDataPreview,
  },

  // DDIC_CDS
  {
    name: "GetDDIC_CDS",
    description: "Retrieve CDS view definition",
    inputSchema: {
      type: "object",
      properties: {
        object_name: {
          type: "string",
          description: "CDS view name",
        },
      },
      required: ["object_name"],
    },
    handler: handlers.handleDDICCDS.handleDDICCDS,
  },

  // DDIC_DataElements
  {
    name: "GetDDIC_DataElements",
    description: "Retrieve data element definition",
    inputSchema: {
      type: "object",
      properties: {
        object_name: {
          type: "string",
          description: "Data element name",
        },
      },
      required: ["object_name"],
    },
    handler: handlers.handleDDICDataElements.handleDDICDataElements,
  },

  // DDIC_Domains
  {
    name: "GetDDIC_Domains",
    description: "Retrieve domain definition",
    inputSchema: {
      type: "object",
      properties: {
        object_name: {
          type: "string",
          description: "Domain name",
        },
      },
      required: ["object_name"],
    },
    handler: handlers.handleDDICDomains.handleDDICDomains,
  },

  // DDIC_Table
  {
    name: "GetDDIC_Table",
    description: "Retrieve table definition via DDIC",
    inputSchema: {
      type: "object",
      properties: {
        object_name: {
          type: "string",
          description: "Table name",
        },
      },
      required: ["object_name"],
    },
    handler: handlers.handleDDICTable.handleDDICTable,
  },

  // DDIC_TypeInfo
  {
    name: "GetDDIC_TypeInfo",
    description: "Retrieve DDIC type information",
    inputSchema: {
      type: "object",
      properties: {
        object_name: {
          type: "string",
          description: "Type name",
        },
      },
      required: ["object_name"],
    },
    handler: handlers.handleDDICTypeInfo.handleDDICTypeInfo,
  },

  // Get_Class
  {
    name: "GetClass",
    description: "Retrieve ABAP class source code",
    inputSchema: {
      type: "object",
      properties: {
        class_name: {
          type: "string",
          description: "Name of the ABAP class",
        },
      },
      required: ["class_name"],
    },
    handler: handlers.handleGetClass.handleGetClass,
  },

  // Get_Function
  {
    name: "GetFunction",
    description: "Retrieve ABAP function module source code",
    inputSchema: {
      type: "object",
      properties: {
        function_name: {
          type: "string",
          description: "Function module name",
        },
        function_group: {
          type: "string",
          description: "Function group name",
        },
      },
      required: ["function_name", "function_group"],
    },
    handler: handlers.handleGetFunction.handleGetFunction,
  },

  // Get_FunctionGroup
  {
    name: "GetFunctionGroup",
    description: "Retrieve ABAP function group source code",
    inputSchema: {
      type: "object",
      properties: {
        function_group: {
          type: "string",
          description: "Function group name",
        },
      },
      required: ["function_group"],
    },
    handler: handlers.handleGetFunctionGroup.handleGetFunctionGroup,
  },

  // Get_Include
  {
    name: "GetInclude",
    description: "Retrieve ABAP include source code",
    inputSchema: {
      type: "object",
      properties: {
        include_name: {
          type: "string",
          description: "Include name",
        },
      },
      required: ["include_name"],
    },
    handler: handlers.handleGetInclude.handleGetInclude,
  },

  // Get_Interface
  {
    name: "GetInterface",
    description: "Retrieve ABAP interface source code",
    inputSchema: {
      type: "object",
      properties: {
        interface_name: {
          type: "string",
          description: "Interface name",
        },
      },
      required: ["interface_name"],
    },
    handler: handlers.handleGetInterface.handleGetInterface,
  },

  // Get_MessageClass
  {
    name: "GetMessageClass",
    description: "Retrieve ABAP message class information",
    inputSchema: {
      type: "object",
      properties: {
        MessageClass: {
          type: "string",
          description: "Message class name",
        },
      },
      required: ["MessageClass"],
    },
    handler: handlers.handleGetMessageClass.handleGetMessageClass,
  },

  // Get_Package
  {
    name: "GetPackage",
    description: "Retrieve ABAP package details",
    inputSchema: {
      type: "object",
      properties: {
        package_name: {
          type: "string",
          description: "Package name",
        },
      },
      required: ["package_name"],
    },
    handler: handlers.handleGetPackage.handleGetPackage,
  },

  // Get_Program
  {
    name: "GetProgram",
    description: "Retrieve ABAP program source code",
    inputSchema: {
      type: "object",
      properties: {
        program_name: {
          type: "string",
          description: "Program name",
        },
      },
      required: ["program_name"],
    },
    handler: handlers.handleGetProgram.handleGetProgram,
  },

  // Get_Structure
  {
    name: "GetStructure",
    description: "Retrieve ABAP Structure",
    inputSchema: {
      type: "object",
      properties: {
        structure_name: {
          type: "string",
          description: "Name of the ABAP Structure",
        },
      },
      required: ["structure_name"],
    },
    handler: handlers.handleGetStructure.handleGetStructure,
  },

  // Get_Table
  {
    name: "GetTable",
    description: "Retrieve ABAP table structure",
    inputSchema: {
      type: "object",
      properties: {
        table_name: {
          type: "string",
          description: "Name of the ABAP table",
        },
      },
      required: ["table_name"],
    },
    handler: handlers.handleGetTable.handleGetTable,
  },

  // Get_TableContents
  {
    name: "GetTableContents",
    description: "Retrieve contents of an ABAP table",
    inputSchema: {
      type: "object",
      properties: {
        table_name: {
          type: "string",
          description: "Name of the ABAP table",
        },
        max_rows: {
          type: "number",
          description: "Maximum number of rows to retrieve",
          default: 100,
        },
      },
      required: ["table_name"],
    },
    handler: handlers.handleGetTableContents.handleGetTableContents,
  },

  // Get_Transaction
  {
    name: "GetTransaction",
    description: "Retrieve ABAP transaction details",
    inputSchema: {
      type: "object",
      properties: {
        transaction_name: {
          type: "string",
          description: "Transaction name",
        },
      },
      required: ["transaction_name"],
    },
    handler: handlers.handleGetTransaction.handleGetTransaction,
  },

  // Get_TypeInfo
  {
    name: "GetTypeInfo",
    description: "Retrieve ABAP type information",
    inputSchema: {
      type: "object",
      properties: {
        type_name: {
          type: "string",
          description: "Name of the ABAP type",
        },
      },
      required: ["type_name"],
    },
    handler: handlers.handleGetTypeInfo.handleGetTypeInfo,
  },

  // SearchObject
  {
    name: "SearchObject",
    description: "Search for ABAP objects using quick search",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query string",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of results to return",
          default: 100,
        },
      },
      required: ["query"],
    },
    handler: handlers.handleSearchObject.handleSearchObject,
  },

  // GetWhereUsed
  {
    name: "GetWhereUsed",
    description: "Retrieve references and usage locations for an ABAP object",
    inputSchema: {
      type: "object",
      properties: {
        object_name: {
          type: "string",
          description: "Name of the ABAP object",
        },
        object_type: {
          type: "string",
          description:
            "Type of the ABAP object (CLASS, INTERFACE, PROGRAM, FUNCTION, TABLE, etc.)",
          default: "CLASS",
        },
        max_results: {
          type: "number",
          description: "Maximum number of results to return",
          default: 100,
        },
      },
      required: ["object_name"],
    },
    handler: handlers.handleWhereUsed.handleGetWhereUsed,
  },

  // RuntimeDumps
  {
    name: "GetRuntimeDumps",
    description: "Retrieve ABAP runtime dump list",
    inputSchema: {
      type: "object",
      properties: {
        start_date: {
          type: "string",
          description: "Start date (YYYY-MM-DD format)",
        },
        end_date: {
          type: "string",
          description: "End date (YYYY-MM-DD format)",
        },
        start_time: {
          type: "string",
          description: "Start time (HH:MM:SS format)",
          default: "00:00:00",
        },
        end_time: {
          type: "string",
          description: "End time (HH:MM:SS format)",
          default: "23:59:59",
        },
        category: {
          type: "string",
          description: "Category filter (optional)",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of results to return",
          default: 1,
        },
      },
    },
    handler: handlers.handleRuntimeDumps.handleRuntimeDumps,
  },

  // RuntimeDumpDetails
  {
    name: "GetRuntimeDumpDetails",
    description: "Retrieve detailed ABAP runtime dump information",
    inputSchema: {
      type: "object",
      properties: {
        dump_id: {
          type: "string",
          description: "Runtime dump ID",
        },
        type: {
          type: "string",
          description: "Detail type (dbAccesses, hitlist, statements)",
        },
      },
      required: ["dump_id"],
    },
    handler: handlers.handleRuntimeDumpDetails.handleRuntimeDumpDetails,
  },

  // Get_ABAPTraces
  {
    name: "GetABAPTraces",
    description: "List ABAP trace entries for a user",
    inputSchema: {
      type: "object",
      properties: {
        user: {
          type: "string",
          description: "User name to filter traces",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of results to return",
          default: 100,
        },
        objectNameFilter: {
          type: "string",
          description: "Object name filter",
        },
      },
    },
    handler: handlers.handleGetABAPTraces.handleGetABAPTraces,
  },

  // Get_ABAPTracesDetails
  {
    name: "GetABAPTracesDetails",
    description: "Retrieve detailed trace data for a trace ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Trace ID",
        },
        type: {
          type: "string",
          description: "Detail type (dbAccesses, hitlist, statements)",
        },
      },
      required: ["id"],
    },
    handler: handlers.handleGetABAPTracesDetails.handleGetABAPTracesDetails,
  },
];
