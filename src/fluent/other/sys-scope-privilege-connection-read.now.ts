import { CrossScopePrivilege } from '@servicenow/sdk/core'

CrossScopePrivilege({
    $id: Now.ID['sys_connection_read_privilege'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_connection',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
