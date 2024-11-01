<?php

namespace Xpyct\SqlViewer;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Xpyct\SqlViewer\Console\Commands\InstallCommand;
class SqlViewerServiceProvider extends ServiceProvider
{
    public static function basePath(string $path): string
    {
        return __DIR__.'/..'.$path;
    }
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/sql-viewer.php', 'sql-viewer'
        );
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/sql-viewer.php' => config_path('sql-viewer.php'),
        ], 'sql-viewer-config');

        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/sql-viewer'),
        ], 'sql-viewer-assets');

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'sql-viewer');

        $this->registerRoutes();
        $this->registerCommands();
        $this->registerGate();
    }

    protected function registerRoutes(): void
    {
        if ($this->app['config']->get('sql-viewer.enabled', true)) {
            Route::group($this->routeConfiguration(), function () {
                $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
            });
        }
    }

    protected function routeConfiguration(): array
    {
        return [
            'prefix' => config('sql-viewer.path', 'sql-viewer'),
            'middleware' => config('sql-viewer.middleware', ['web']),
        ];
    }

    protected function registerGate(): void
    {
        Gate::define('viewSqlViewer', function ($user = null) {
            return $this->app->environment('local') ||
                   (config('sql-viewer.enabled', true) &&
                    in_array($user->email, config('sql-viewer.allowed_emails', [])));
        });
    }

    protected function registerCommands(): void
    {
        $this->commands([
            InstallCommand::class,
        ]);
    }
}
