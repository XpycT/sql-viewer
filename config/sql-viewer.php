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
     * Forbidden actions in SQL queries
     */
    'forbidden_actions' => [
        'DROP',
        'TRUNCATE',
        'DELETE',
        'CREATE',
    ],

    /*
     * Maximum number of rows that can be returned from a query (add it to the LIMIT clause)
     */
    'max_limit' => 100,
];
