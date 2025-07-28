import { McpError, ErrorCode, AxiosResponse } from '../lib/utils';
import { makeAdtRequest, return_error, return_response, getBaseUrl } from '../lib/utils';

interface SearchObjectArgs {
    query: string;
    maxResults?: number;
}

export async function handleSearchObject(args: SearchObjectArgs) {
    try {
        if (!args?.query) {
            throw new McpError(ErrorCode.InvalidParams, 'Search query is required');
        }
        const maxResults = args.maxResults || 100;
        const url = `${await getBaseUrl()}/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=${encodeURIComponent(args.query)}*&maxResults=${maxResults}`;
        const response = await makeAdtRequest(url, 'GET', 30000);
        return return_response(response);
    } catch (error) {
        return return_error(error);
    }
}
