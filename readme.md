<div align="center">
    <p>
        <h1>SQL Viewer for Laravel</h1>
    </p>
</div>

<p align="center">
    <a href="#requirements">Requirements</a> |
    <a href="#installation">Installation</a> |
    <a href="#usage">Usage</a>
</p>

![sql-viewer](https://github.com/user-attachments/assets/f57fe1d8-45f5-421f-ada4-17aad5b54536)


### Documentation

Documentation can be found on the [official website](#).

## Get Started

### Requirements

- **PHP 8.0+**
- **Laravel 8+**

### Installation

To install the package via composer, Run:

```bash
composer require xpyct/sql-viewer
```

After installing the package, publish the front-end assets by running:

```bash
php artisan sql-viewer:install
```

This is the content that will be published to config/sql-viewer.php

```php
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

```

### Usage

Once the installation is complete, you will be able to access **SQL Viewer** directly in your browser.

By default, the application is available at: `{APP_URL}/sql-viewer`.

### Authorization

To authorize, add your email to the sql-viewer config and set enabled variable.

You can register a viewSqlViewer gate with your own logic. A good place to do this is in the AuthServiceProvider that ships with Laravel.

```php
public function boot()
{
    Gate::define('viewSqlViewer', function ($user = null) {
        return true;
    });
}
```

## Credits

- [XpycT](https://github.com/XpycT)

## License

The MIT License (MIT).
