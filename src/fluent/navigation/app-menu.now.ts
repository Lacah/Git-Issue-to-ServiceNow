import "@servicenow/sdk/global";
import { ApplicationMenu, Record } from "@servicenow/sdk/core";

// Application Menu - top level in navigator
const applicationMenu = ApplicationMenu({
    $id: Now.ID['git-issue-sync-menu'],
    title: 'Git Issue Sync',
    hint: 'Synchronize GitHub issues to ServiceNow',
    description: 'Tools for synchronizing GitHub repository issues, milestones, and labels into ServiceNow',
    roles: ['admin'],
    active: true
});

// Module: Sync Tool (main UI page)
Record({
    $id: Now.ID['module-sync-tool'],
    table: 'sys_app_module',
    data: {
        title: 'Sync Issues',
        application: applicationMenu,
        link_type: 'DIRECT',
        query: 'x_snc_git_issue_sync.do',
        hint: 'Open the GitHub issue sync tool',
        roles: ['admin'],
        active: true,
        order: 100
    }
});

// Separator: Data
Record({
    $id: Now.ID['module-separator-data'],
    table: 'sys_app_module',
    data: {
        title: 'Data',
        application: applicationMenu,
        link_type: 'SEPARATOR',
        roles: ['admin'],
        active: true,
        order: 200
    }
});

// Module: GitHub Issues list
Record({
    $id: Now.ID['module-issues-list'],
    table: 'sys_app_module',
    data: {
        title: 'GitHub Issues',
        application: applicationMenu,
        link_type: 'LIST',
        name: 'x_snc_git_issue_record',
        hint: 'View synced GitHub issues',
        roles: ['admin'],
        active: true,
        order: 300
    }
});

// Module: Milestones list
Record({
    $id: Now.ID['module-milestones-list'],
    table: 'sys_app_module',
    data: {
        title: 'Milestones',
        application: applicationMenu,
        link_type: 'LIST',
        name: 'x_snc_git_issue_milestone',
        hint: 'View synced milestones',
        roles: ['admin'],
        active: true,
        order: 400
    }
});

// Module: Sync History list
Record({
    $id: Now.ID['module-sync-history-list'],
    table: 'sys_app_module',
    data: {
        title: 'Sync History',
        application: applicationMenu,
        link_type: 'LIST',
        name: 'x_snc_git_issue_sync_history',
        hint: 'View past sync operations',
        roles: ['admin'],
        active: true,
        order: 500
    }
});

// Separator: Configuration
Record({
    $id: Now.ID['module-separator-config'],
    table: 'sys_app_module',
    data: {
        title: 'Configuration',
        application: applicationMenu,
        link_type: 'SEPARATOR',
        roles: ['admin'],
        active: true,
        order: 600
    }
});

// Module: Properties
Record({
    $id: Now.ID['module-properties'],
    table: 'sys_app_module',
    data: {
        title: 'Properties',
        application: applicationMenu,
        link_type: 'LIST',
        name: 'sys_properties',
        filter: 'nameLIKEx_snc_git_issue',
        hint: 'Configure application properties',
        roles: ['admin'],
        active: true,
        order: 700
    }
});
