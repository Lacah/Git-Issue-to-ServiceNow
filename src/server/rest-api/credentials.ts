import { gs, GlideRecord } from '@servicenow/glide';

export function getCredentials(request: any, response: any) {
    try {
        var credentials: any[] = [];
        var gr = new GlideRecord('discovery_credentials');
        gr.addActiveQuery();
        gr.orderBy('name');
        gr.query();

        while (gr.next()) {
            credentials.push({
                sys_id: gr.getUniqueValue(),
                name: gr.getDisplayValue('name'),
                type: gr.getValue('type')
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
