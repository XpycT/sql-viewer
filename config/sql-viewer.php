<?php

return [
    'enabled' => env('SQL_VIEWER_ENABLED', true),

    'path' => env('SQL_VIEWER_PATH', 'sql-viewer'),

    'middleware' => [
        'web',
        // Uncomment this if you want to add auth middleware
        // 'auth',
    ],

    'allowed_emails' => [
        // 'admin@example.com',
    ],

    'hidden_fields' => [
        'password',
        'token',
        'secret',
        'api_key',
        'credit_card',
        'card_number'
    ],

    'forbidden_querys' => [
        'drop',
        'truncate',
        'delete',
        'insert',
    ],
];
