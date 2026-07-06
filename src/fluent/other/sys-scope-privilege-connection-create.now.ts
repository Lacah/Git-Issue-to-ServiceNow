import { CrossScopePrivilege } from '@servicenow/sdk/core'

CrossScopePrivilege({
    $id: Now.ID['sys_connection_create_privilege'],
    operation: 'create',
    status: 'allowed',
    targetName: 'sys_connection',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
