import "@servicenow/sdk/global";
import { RestApi } from "@servicenow/sdk/core";
import { startSync } from "../../server/rest-api/sync-start";
import { getProgress } from "../../server/rest-api/sync-progress";
import { getCredentials } from "../../server/rest-api/credentials";

RestApi({
    $id: Now.ID['sync-api'],
    name: 'Git Issue Sync API',
    serviceId: 'sync',
    shortDescription: 'API for triggering GitHub issue syncs and monitoring progress',
    consumes: 'application/json',
    produces: 'application/json',
    routes: [
        {
            $id: Now.ID['sync-start-route'],
            name: 'Start Sync',
            path: '/start',
            method: 'POST',
            script: startSync,
            shortDescription: 'Trigger a new GitHub issue sync operation',
            version: 1
        },
        {
            $id: Now.ID['sync-progress-route'],
            name: 'Get Progress',
            path: '/progress/{sync_id}',
            method: 'GET',
            script: getProgress,
            shortDescription: 'Get the current progress of a sync operation',
            version: 1
        },
        {
            $id: Now.ID['sync-credentials-route'],
            name: 'Get Credentials',
            path: '/credentials',
            method: 'GET',
            script: getCredentials,
            shortDescription: 'List available credentials for authentication',
            version: 1
        }
    ],
    versions: [
        {
            $id: Now.ID['sync-api-v1'],
            version: 1,
            isDefault: true,
            shortDescription: 'Version 1 of the Git Issue Sync API'
        }
    ]
});
