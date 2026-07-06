import { gs, GlideRecord } from '@servicenow/glide';

export function searchAliases(request: any, response: any) {
    try {
        // queryParams values can be arrays or strings depending on the framework version
        var rawQ = request.queryParams ? request.queryParams.q : null;
        var query = '';
        if (rawQ) {
            query = Array.isArray(rawQ) ? String(rawQ[0] || '') : String(rawQ);
        }

        var gr = new GlideRecord('sys_alias');
        if (!gr.isValid()) {
            // Table not accessible - return empty results
            response.setStatus(200);
            response.setBody({ success: true, data: [], message: 'sys_alias table not accessible from this scope' });
            return;
        }
        gr.addQuery('type', 'credential');
        if (query) {
            gr.addQuery('name', 'CONTAINS', query);
        }
        gr.orderBy('name');
        gr.setLimit(20);
        gr.query();

        var results: any[] = [];
        while (gr.next()) {
            results.push({
                sys_id: gr.getUniqueValue(),
                name: gr.getValue('name'),
                id: gr.getValue('id')
            });
        }

        response.setStatus(200);
        response.setBody({
            success: true,
            data: results
        });
    } catch (e: any) {
        gs.error('GitIssueSync: Alias search error — ' + e.message);
        response.setStatus(200);
        response.setBody({ success: false, data: [], error: 'Failed to search aliases: ' + e.message });
    }
}
