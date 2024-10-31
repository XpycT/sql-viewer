<?php

return [
    /*
     * By default this package will only run in local development.
     * Do not change this, unless you know what your are doing.
     */
    'enabled' => env('SQL_VIEWER_ENABLED', env('APP_ENV') === 'local'),

    /*
     * The SqlViewer page will be available on this path.
     */
    'path' => env('SQL_VIEWER_PATH', 'sql-viewer'),

    /*
    * These middleware will be assigned to every SqlViewer route, giving you the chance
    * to add your own middlewares to this list or change any of the existing middleware.
    */
    'middleware' => [
        'web',
        // Uncomment this if you want to add auth middleware
        // 'auth',
    ],

    /*
     * These emails will be allowed to access the SqlViewer.
     */
    'allowed_emails' => [
        // 'admin@example.com',
    ],

    /*
     * These fields will be hidden (marked with *) from the SqlViewer result table by default.
     */
    'hidden_fields' => [
        'password',
        'token',
        'secret',
        'api_key',
        'credit_card',
        'card_number'
    ],

    /*
     * Forbidden actions in SQL queries
     */
    'forbidden_actions' => [
        'drop',
        'truncate',
        'delete',
        'insert',
    ],
];
