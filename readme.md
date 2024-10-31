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

![sql-viewer](https://github.com/user-attachments/assets/5a7730a9-1cac-4b6c-a00d-6fa938a32d48)

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
