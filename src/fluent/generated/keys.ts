import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    '3f9cd6e247b1079088c685e2e16d4349': {
                        table: 'sys_scope_privilege'
                        id: '3f9cd6e247b1079088c685e2e16d4349'
                    }
                    '7b9c1ae247b1079088c685e2e16d430c': {
                        table: 'sys_scope_privilege'
                        id: '7b9c1ae247b1079088c685e2e16d430c'
                    }
                    '844e5a6a47b1079088c685e2e16d4395': {
                        table: 'sys_scope_privilege'
                        id: '844e5a6a47b1079088c685e2e16d4395'
                    }
                    '8c4e5a6a47b1079088c685e2e16d43fc': {
                        table: 'sys_scope_privilege'
                        id: '8c4e5a6a47b1079088c685e2e16d43fc'
                    }
                    '8c4e9a6a47b1079088c685e2e16d4300': {
                        table: 'sys_scope_privilege'
                        id: '8c4e9a6a47b1079088c685e2e16d4300'
                    }
                    '8c4e9a6a47b1079088c685e2e16d4304': {
                        table: 'sys_scope_privilege'
                        id: '8c4e9a6a47b1079088c685e2e16d4304'
                    }
                    '8c4e9a6a47b1079088c685e2e16d4308': {
                        table: 'sys_scope_privilege'
                        id: '8c4e9a6a47b1079088c685e2e16d4308'
                    }
                    '8c4e9a6a47b1079088c685e2e16d430c': {
                        table: 'sys_scope_privilege'
                        id: '8c4e9a6a47b1079088c685e2e16d430c'
                    }
                    'ac-patterns-property': {
                        table: 'sys_properties'
                        id: 'd37fecb3fd264d069162f4cdb4c189e0'
                    }
                    AcceptanceCriteriaParser: {
                        table: 'sys_script_include'
                        id: 'ef572cedf07a40069b2161d511a0b79d'
                    }
                    b73e5a6a47b1079088c685e2e16d438d: {
                        table: 'sys_scope_privilege'
                        id: 'b73e5a6a47b1079088c685e2e16d438d'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '6db9de5ac6724fb682503da3875cf5dc'
                    }
                    'br-run-queued-sync': {
                        table: 'sys_script'
                        id: 'fc0ecf45ff9b4c7a8a1cde8bcf7080d2'
                    }
                    'git-issue-sync-menu': {
                        table: 'sys_app_application'
                        id: '90965ae0007e4d1997e21797205d0cab'
                    }
                    GitHubAPIClient: {
                        table: 'sys_script_include'
                        id: '96130a531fab42ff8d98523feae5a93c'
                    }
                    LabelManager: {
                        table: 'sys_script_include'
                        id: 'e86f72712f9a4135ab4e88b8dc9ea45d'
                    }
                    MarkdownConverter: {
                        table: 'sys_script_include'
                        id: '4b6c56b6d5bb4658bc81606ffede28ea'
                    }
                    'module-issues-list': {
                        table: 'sys_app_module'
                        id: '0ebf3224f0fa4ef89037bfbc3aa26598'
                    }
                    'module-milestones-list': {
                        table: 'sys_app_module'
                        id: '6aadbef8427348c79b44b07d86bda00f'
                    }
                    'module-properties': {
                        table: 'sys_app_module'
                        id: '9f9b60c3c5a545ff980f66234cb3b795'
                    }
                    'module-separator-config': {
                        table: 'sys_app_module'
                        id: '3bfd7dadd7d94fee9c2c9b00bb3814ac'
                    }
                    'module-separator-data': {
                        table: 'sys_app_module'
                        id: '0090e940bdee480eab7a709d5fe42633'
                    }
                    'module-sync-history-list': {
                        table: 'sys_app_module'
                        id: 'a5955f17a6cd4449a90cbc55072ad8ba'
                    }
                    'module-sync-tool': {
                        table: 'sys_app_module'
                        id: '095433a3f68d49e0870893a6732a5986'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'eebcf700373b4d8e95eeeda13ea0ce88'
                    }
                    'src_server_business-rules_run-queued-sync_ts': {
                        table: 'sys_module'
                        id: '1ae7ddd624c64730a6aa1bf7ec4e8c40'
                    }
                    'src_server_rest-api_credentials_ts': {
                        table: 'sys_module'
                        id: '43da879e7d84490093d550e5738954a0'
                    }
                    'src_server_rest-api_sync-progress_ts': {
                        table: 'sys_module'
                        id: '07755fa7aea945dda8960e9b17262062'
                    }
                    'src_server_rest-api_sync-start_ts': {
                        table: 'sys_module'
                        id: '7354d535c30d40029daa8425ccdad9e6'
                    }
                    'src_server_script-includes_AcceptanceCriteriaParser_js': {
                        table: 'sys_module'
                        id: 'bc63385666b44dc7bca80bfad57dcf8f'
                    }
                    'src_server_script-includes_GitHubAPIClient_js': {
                        table: 'sys_module'
                        id: 'bdd02057278f4c58bc5d360dfda05728'
                    }
                    'src_server_script-includes_LabelManager_js': {
                        table: 'sys_module'
                        id: 'c8217fabdaea42d5ab4a8896f7fd1a31'
                    }
                    'src_server_script-includes_MarkdownConverter_js': {
                        table: 'sys_module'
                        id: 'ae230dc6dac44576ad15afcbd2997fc9'
                    }
                    'src_server_script-includes_SyncOrchestrator_js': {
                        table: 'sys_module'
                        id: 'c0a75335c35a4fec99061d33045cf20c'
                    }
                    'sync-api': {
                        table: 'sys_ws_definition'
                        id: 'ddf0cd01b98244bf87ff25d062167010'
                    }
                    'sync-api-v1': {
                        table: 'sys_ws_version'
                        id: '37c80ddd1ae041abad4c3c8c0cb8f28b'
                    }
                    'sync-credentials-route': {
                        table: 'sys_ws_operation'
                        id: 'f59cdd86163e4fb48dee3f330d0e171e'
                    }
                    'sync-progress-route': {
                        table: 'sys_ws_operation'
                        id: '1ead31cd74ac4583bc1dda0dcf057e3f'
                    }
                    'sync-start-route': {
                        table: 'sys_ws_operation'
                        id: 'd067161a793e417c96ff920355ed0db9'
                    }
                    SyncOrchestrator: {
                        table: 'sys_script_include'
                        id: 'c80f6163c87043239c0ff42cdb72d624'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '0064c61a3db24dabbebe13876e7cf463'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            element: 'github_issue_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '017d0f8101f44ed7b7d387b156a175f2'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '16'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0359cb40ccb54a46872200f4758ed51a'
                        key: {
                            sys_ui_section: {
                                id: '0c07694434774c9796d65559ef1acdd6'
                                key: {
                                    name: 'x_snc_git_issue_story_xref'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'repository_url'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '056064dc348a44af87d1865bf3713861'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '25'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '05bb92c6d9c54222a0c143cc60e5c9c7'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_created_at'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '07ceecb483fa45c4a12354824ab809dd'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '09846496c0e7416091599caed13a44cb'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'error_message'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0afc2cd43cac4c0ba1dafebf6f8f87e0'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '0c07694434774c9796d65559ef1acdd6'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            caption: 'General'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0cb6acb6d878403b9e8d277131d47e45'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_updated_at'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '0d82fa467e794352a4a1033dda28371d'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0e7092e798f44a01bdec45a30ed86d61'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'milestone'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '10c621e5996f43de88aba8a117246905'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '122de057a3a7455fa95cdbe809f2ed5f'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'progress_message'
                            position: '24'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '17ae176b21274e0aae834364b7b4d096'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'github_closed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '18102fdf748948be88a6df7085d2e17a'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_mode'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '18e7537c19da496492736a4f1959202e'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1b39b4eb99044c34b47fa2e649f1c7f3'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1b9cfd214f7b435ab421cde97b6c32c1'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'update_existing'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1bb95f77eaa442df883f8d8879e168e6'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'state_filter'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1c7ec685520649fbb4ce53e908f83892'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'current_phase'
                            position: '19'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1d3d04ac489f4ce28ceabedc421c0f64'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'synced_by'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1d548f1c4a2740508e025f533862e799'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '1e15ee994a8340568a3ae4709dcc7802'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1ed18eccdd654b53b31fcc1f2c497e04'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'milestones_created'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '24eee933e8f3433ebcfc470d2a701c7a'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            element: 'story'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '25cd34df5e4340d095ed1b011a82764c'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '17'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '26f84bbb15824782a3f440dad7b9255f'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '27e00dc2964f4e22ad644acfeb5764de'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'repository_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '27ea558b3336431eb28d4c8019b999f6'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            element: 'repository_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '291ce97830284c56808084ae50f92b56'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '29a4335c05d64b27b4275b3f95019ca3'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'github_created_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2b1c032b6b234ba5a1e28d01a866a743'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_author'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2f481101955b416ba537a6efd8535b11'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'milestone_number'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2fa97e91b6294dc0b37011d1056fd47e'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_author'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2fc6d00ce94f42d0881da181f85add91'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'current_item'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '336843e018c8421881f1d3c0184bfd3c'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '337619ad956d4b7b8364077ccbc1d269'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'current_phase'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '357e4d797f06441aa60f8dd1a95c595d'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'status'
                            value: 'queued'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '378350bca1f04bee97a65f423877a2b1'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'milestones_updated'
                            position: '15'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '386a7486afa849be9f1f96478a8404b5'
                        key: {
                            sys_ui_section: {
                                id: '0c07694434774c9796d65559ef1acdd6'
                                key: {
                                    name: 'x_snc_git_issue_story_xref'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3891af2720d04bc5b7643acb91483322'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'percent_complete'
                            position: '23'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '39c0f557a9144873a26399a68ea08108'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'synced_by'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3a145f929c5449f185a73c5074442884'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3a152119f59641ceb177c0c2ecd58851'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_state'
                            value: 'closed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3ae0ed8d31fd4c438583b052de0aaf10'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'body_html'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '3d902390c3c44b0a886602d8cab1fc87'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4029d620fb7a48f6acefc6aa061c98e2'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '409a1af9cafb4247a17821fea3d0c3d0'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_mode'
                            value: 'user_story'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '40ff0a18b02548eba3a907be43cfb2e5'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'milestones_created'
                            position: '14'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '43cb3df2427f45f699aae6eefd29bcd4'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_start'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '443451b8d9ce4bff82a18d66fd59095f'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sync_start'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4450ee55e22146d28f73c49aee87f202'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '45de8f58961946ce80d1e505b42db697'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'state'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4645cb512f14484cbf91e3bb2647fd66'
                        key: {
                            sys_ui_section: {
                                id: '0c07694434774c9796d65559ef1acdd6'
                                key: {
                                    name: 'x_snc_git_issue_story_xref'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '47198cb3301848f1b239993a6e1e8801'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            caption: 'General'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '48818c499a594a5b8377b734213c6785'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '49e573460cbc4469bb12862be2b93e04'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4a6049f4468d4876a6914035877cedf5'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4acc236e54f74821b6ce348935034292'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'github_updated_at'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '4b14b89150df4973b6b3e02930acd7fd'
                        key: {
                            sys_ui_form: {
                                id: 'c42ed2f5af6c41de82397880df106e96'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4b8c104585af40f78081d2946168068c'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'total_items'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4c383ebdba9245e3813e7f22b979747f'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4e9472a03bbe4233a1219dcfe8a14efe'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'due_date'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4ea268b9ea514dac85ec9df8844e1e2e'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'state_filter'
                            value: 'closed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4ea883fd633f46ebb3eebcc0c2c5a5de'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_end'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '50fd5dbc2aaa48a1a3349e00c8c90a23'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'milestones_created'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '51007119d02f4b4c939a6dc079edf259'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5374c138c8f243109f7d0c1996d1286e'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '21'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '54848272ca4c41468396453a40b424e1'
                        key: {
                            sys_ui_form: {
                                id: '63bdbba0e9f74766991f8f43f4f69f02'
                                key: {
                                    name: 'x_snc_git_issue_story_xref'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '0c07694434774c9796d65559ef1acdd6'
                                key: {
                                    name: 'x_snc_git_issue_story_xref'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '554ff32d481041578b7f801ec5447024'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'issues_updated'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '55db1fa59f394487a54f508badb64232'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'due_date'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '577460c7148c465e8b5876833aa09f0c'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'milestone_number'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '597d40b8706a42fdb92bae7f9d49a9e3'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5cd4b2834abd4c50a47a32211e951c9a'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'github_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5e21c59b241a48d8bae5b6d5014fd71d'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'title'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5e4511d44de2403b96b8daf9ea329a12'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'status'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5f22b5b800ed4016a28e6afdc3700f18'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'repository_url'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '608ac2e0ed744baf844f54df0fbc951c'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6256dcb2d5b549e39e3731f211768de6'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_url'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '63bdbba0e9f74766991f8f43f4f69f02'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '63e40790f6c74b5fbbf654970141acf2'
                        key: {
                            sys_ui_form: {
                                id: 'e1074609af374c97acbc4632d8ced38e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '63f8880d947241d095be553dec603732'
                        key: {
                            application_file: 'a827302515c64010a3e9d3bdf21d817f'
                            source_artifact: 'de47b095fb0342caa92f94073786c752'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '654b85377b234333b9fc16fdd5e3abf4'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'repository_url'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '655ec9d39457426ea51905f768bb7bc5'
                        key: {
                            sys_ui_section: {
                                id: '0c07694434774c9796d65559ef1acdd6'
                                key: {
                                    name: 'x_snc_git_issue_story_xref'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_issue_number'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6608cf943ad6454fa63c6368ec1b5071'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'description'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '667dfa1e46ee4445aab1a9ceaf83e4ef'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'labels_created'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '669554b37b6d42ee954849c61d0a41e0'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'issues_skipped'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '67ffb10b28884f5e8b29f8b8455592e9'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'credential'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '69756d0c05474f93993d0c121b5aa2e4'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'repository_url'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '6b591be107ef4b53b2a3aa114ac793d0'
                        key: {
                            endpoint: 'x_snc_git_issue_sync.do'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6bf45975b3d4416182c1b9cc655d1c85'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'percent_complete'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6c07cb2fad904e60942fe64be870869f'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_closed_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6d218b1f15084d9396eabafc0355bcff'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'labels_created'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6d91df051841466697ce139e186cbbe3'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6e711b82c36f472db49b07335a864d8f'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'status'
                            value: 'in_progress'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '70b3cbaa4b3642baa79a883a4f95ef5e'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'progress_message'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '70c51f9f45134492bff2286154cecc0f'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'issues_created'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '71cb37d2b45144a6a1d48cfc1d89031e'
                        key: {
                            name: 'x_snc_git_issue_record'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '737fb6e4b6f74947a4c91febfa0a4f8f'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_author'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '74bd0772dfa348d5ab6498d554688326'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            element: 'story'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '74cb8ad253ad4d6aa8e8ea28742d747b'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '74cd7d041da745e9bbf7a23265c237e7'
                        key: {
                            category: 'x_snc_git_issue_record'
                            prefix: 'GHI'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '74e1b0dd9e984cb7834156ec702fe293'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'credential'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '76891e0fb58c4263bcdd918e0d0c9afc'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_updated_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '79b8b05851d04f7582299804db97bbd1'
                        key: {
                            sys_ui_form: {
                                id: '48818c499a594a5b8377b734213c6785'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7d9ef85e883241c889fe1aa132940f51'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_url'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7fd163ebdd564315b00030a245ef10e3'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'github_updated_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8089d32110a24edbaf1b6684c8dc8358'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'repository_url'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '808e310fec8d445aa5a2059fcd060271'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'progress_message'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '80b723c17aff4b39afd2bb74d0330920'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'state_filter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8340476402634ff987325bcacc017df8'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'credential'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '86a090077a1b449f825bdeb93870e4d4'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'issues_updated'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '875ffc8b2477456abb3b1a20b4f6c0db'
                        key: {
                            sys_ui_section: {
                                id: '0c07694434774c9796d65559ef1acdd6'
                                key: {
                                    name: 'x_snc_git_issue_story_xref'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '883c7bd12b35467a8038c2c59def5831'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_updated_at'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8cc1dc3dde15441fb8bebad6d307a4a3'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '8cfea99b1be048f7bbc76c30ba0a519f'
                        key: {
                            application_file: '6b591be107ef4b53b2a3aa114ac793d0'
                            source_artifact: 'de47b095fb0342caa92f94073786c752'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8dfc18f49a5d4a1897c913f80b760c6f'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8eaf8bf573a74792a3fea11d57fb10df'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8fca053b729642e1af2ad9b2d3d90285'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_created_at'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '958886ca9a204dffa802563a45a98923'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'github_url'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '96075f071c314bdba8933b085612a910'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'issues_updated'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '960b00e0096a48dd9c32d913248ed592'
                        key: {
                            name: 'x_snc_git_issue_record'
                            caption: 'General'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '975abcbf424c49b9815486c2bee11dc0'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'state_filter'
                            value: 'open'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '977630832a2544f3800642335b50e4dc'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'milestone_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '99279471eda74467af53d5cc88bd1b95'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'update_existing'
                            position: '4'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '9a2d37500a2b4c0bb5067e563d517d8d'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '9d4f306fea7c4ffba0130ac59379b530'
                        key: {
                            name: 'x_snc_git_issue_record'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9eec709ca7b945ff91d1a8fe5eb0068d'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'percent_complete'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9ff51368ca5e4e9d9e72de6eccce9f25'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'milestones_updated'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a034c1b485f8431794394355c25d06f4'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'state_filter'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a3266ca99f84438a8bcb9493ea536da7'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'total_items'
                            position: '22'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'a59d2ea7f4684d96b157e56563576237'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'state_filter'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a80b5561a84744c290028c938d3658bb'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'repository_url'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'a827302515c64010a3e9d3bdf21d817f'
                        key: {
                            name: 'x_snc_git_issue/main'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'a8452aaaaea74fc0b2443df2e19f52c5'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a88861fe0a854916b019bf805d434a72'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'labels_created'
                            position: '18'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a9b773c579ca4829922fc421629c1b43'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'error_message'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'aa5f1c1e70984d99af5ed44952d88b8d'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_url'
                            position: '7'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'ab6317a96dd9420196670def6baa1bfd'
                        key: {
                            application_file: 'd1e1f09e144043ecb0bc284d87790d4f'
                            source_artifact: 'de47b095fb0342caa92f94073786c752'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ab844555b1e74dedb0a06baee643f0b9'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ac7a2dbdcdc64756aee0141dbe6a404e'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_closed_at'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ad352d89d4a6428381fc6bd6b0a8682c'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'current_item'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ae154bf7371f4d8d99d2d6ddab844a46'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aee412309c364fdd8a7ed7f8af9fe8c3'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'milestone'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'afadd27987654b30b3403130b4dc3d27'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_created_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b185c9dd14bd4f1392831012c05de650'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_issue_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b4f63dbc4ab04b80bb7b75682eb20ffa'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'issues_created'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b5740052367c4f60b3215dd727f0d0b3'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b6ca7679e2af4f3d88cc085819a28f5a'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'issues_skipped'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b87b9dcbe8d14de08f7b3621d8efefa5'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'github_closed_at'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b8edeffebeca4a08856778b30028848d'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sync_end'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b94ceaa9d378480da787c8c6c138eefe'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'baad9e22fe024f5081db93ffb64bea97'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            element: 'repository_url'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc46a17b251f4075be0d4307a5a642ef'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'repository_url'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c1bf7ec5006641c4bf6d215296dec9c2'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_issue_number'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c2d8def6f97440b09ff138eebff20926'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c41a8e5c78014947aa4a53a899ccc1dc'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'milestones_updated'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'c42ed2f5af6c41de82397880df106e96'
                        key: {
                            name: 'x_snc_git_issue_record'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c5ae6b86cecd4e559d9f50804c2456f2'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c8fe430042904e38b11bb9a451096939'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'due_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c99f45a695654ef69fe0369ce09b68c6'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'issues_skipped'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cb58e6e30c2a471f8eb138885e44a4ae'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'milestone'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cc94c50aa55442639d85c7633d9fc55f'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_state'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cdadad87672742d6be8298667abf1949'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'body_html'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ce489706a32b498385b34c3f48d3aca9'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_start'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd0ed061c9c204b679e757d70c2019de5'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'error_message'
                            position: '26'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd1c093051d98488e957ed6dbcd7fd034'
                        key: {
                            sys_ui_section: {
                                id: '0c07694434774c9796d65559ef1acdd6'
                                key: {
                                    name: 'x_snc_git_issue_story_xref'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'story'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd1ca54c5eeb64b9ebfa0d55daa7b7bd6'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_closed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'd1e1f09e144043ecb0bc284d87790d4f'
                        key: {
                            name: 'x_snc_git_issue/main.js.map'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd23582d24c414e27985e18401f0d22c3'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'status'
                            value: 'failed'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd2a9fbcbadec449996dc4375a84ddea0'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'state'
                            value: 'closed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd33ca34d08ed4cfe86327072453a4341'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'update_existing'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd476d9d44ad8434792e75353761321cb'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'state'
                            value: 'open'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd65ec22c8fe041c1a9375c603c95f74e'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_state'
                            value: 'open'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd79216a9d91e4835ac483fd01b5dfab6'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_mode'
                            value: 'mirror'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd91c892c84994bcaa070ea7c3499abc0'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'title'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd95e9ee1fc8f422fb478e10e2d2df288'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_state'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'daf4e9a6644841f98eb280090157eb3f'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sync_mode'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'db58e55492ca4c9faed30a3c061111d9'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_end'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'de47b095fb0342caa92f94073786c752'
                        key: {
                            name: 'x_snc_git_issue_sync.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'df95f91f48a44d57ae99043a36901975'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'status'
                            value: 'completed_with_errors'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'e1074609af374c97acbc4632d8ced38e'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e1dc885a448949048660bd0a28c4cf7b'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'state_filter'
                            value: 'all'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e3f73478bd664e6daefbf6c0121628ca'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'body_html'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'e406cf09d9a74b6aa7a2b5ccf7667f18'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_mode'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e7ec41de11044ff8994e8351d252b3d5'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'github_created_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ebb7605941274d88838b2157265c04fe'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'sync_mode'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'edd8a55192c44829822ba91f0b43ecac'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'current_phase'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'eec0df7ec80e49ba953e247076e28b72'
                        key: {
                            sys_ui_section: {
                                id: 'f289ad3f2c644846815257df6dd3eb0e'
                                key: {
                                    name: 'x_snc_git_issue_sync_history'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'current_item'
                            position: '20'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ef070342532842589537affc315682c8'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'repository_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'f289ad3f2c644846815257df6dd3eb0e'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            caption: 'General'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f2bac6bcad4042d89ad1eaae653d3853'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_updated_at'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f43860bb4f2d4bf68320efb35008f3bc'
                        key: {
                            sys_ui_section: {
                                id: '960b00e0096a48dd9c32d913248ed592'
                                key: {
                                    name: 'x_snc_git_issue_record'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_issue_number'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f44d5602cc574765913516beafc84b46'
                        key: {
                            sys_ui_section: {
                                id: '47198cb3301848f1b239993a6e1e8801'
                                key: {
                                    name: 'x_snc_git_issue_milestone'
                                    caption: 'General'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'github_closed_at'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f4881f80538d48bcaa0af2e063bf0469'
                        key: {
                            name: 'x_snc_git_issue_record'
                            element: 'github_created_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f5cde00e98034f28acadde9766ca2967'
                        key: {
                            name: 'x_snc_git_issue_story_xref'
                            element: 'github_issue_number'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'f778c45e94e44d67ac4f792af13b27a6'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f889fff33f904ff2b05fb47cb1433dc7'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'issues_created'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fa6ab810ddef47cf9639305140633829'
                        key: {
                            name: 'x_snc_git_issue_milestone'
                            element: 'repository_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fafcd8d35f424d27b500306cea09df26'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'synced_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fd54ccfd818b4ceeab290fb8089eb7bc'
                        key: {
                            name: 'x_snc_git_issue_sync_history'
                            element: 'total_items'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
