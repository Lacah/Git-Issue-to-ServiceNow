import { gs, GlideRecord } from '@servicenow/glide';

export function getCredentials(request: any, response: any) {
    try {
        var searchTerm = request.queryParams.q || '';
        var credentials: any[] = [];
        var gr = new GlideRecord('discovery_credentials');
        gr.addActiveQuery();

        if (searchTerm) {
            gr.addQuery('name', 'CONTAINS', searchTerm);
        }

        gr.orderBy('name');
        gr.setLimit(25);
        gr.query();

        while (gr.next()) {
            credentials.push({
                sys_id: gr.getUniqueValue(),
                name: gr.getDisplayValue('name'),
                type: gr.getValue('type') || '',
                user_name: gr.getValue('user_name') || ''
            });
        }

        response.setStatus(200);
        response.setBody({
            success: true,
            data: credentials
        });
    } catch (e: any) {
        response.setStatus(500);
        response.setBody({ success: false, error: 'Internal server error: ' + e.message });
    }
}
