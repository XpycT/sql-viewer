<?php

namespace Xpyct\SqlViewer\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Watcher\Watch;
use Xpyct\SqlViewer\SqlViewerServiceProvider;
use Illuminate\Support\Str;

class InstallCommand extends Command
{
    protected $signature = 'sql-viewer:install  {--watch}';
    protected $description = 'Install the SQL Viewer package';

    public function handle()
    {
        $this->publishConfiguration();
        $this->publishAssets();

        if ($this->option('watch')) {
            if (! class_exists(Watch::class)) {
                $this->error('Please install the spatie/file-system-watcher package to use the --watch option.');
                $this->info('Learn more at https://github.com/spatie/file-system-watcher');

                return;
            }

            $this->info('Watching for file changes... (Press CTRL+C to stop)');

            Watch::path(SqlViewerServiceProvider::basePath('/public'))
                ->onAnyChange(function (string $type, string $path) {
                    if (Str::endsWith($path, 'manifest.json')) {
                        $this->publishAssets();
                    }
                })
                ->start();
        }

        $this->info('SQL Viewer installed successfully.');
    }

    protected function publishConfiguration()
    {
        $this->call('vendor:publish', [
            '--provider' => 'Xpyct\SqlViewer\SqlViewerServiceProvider',
            '--tag' => 'sql-viewer-config'
        ]);
    }

    protected function publishAssets()
    {
        $this->clearOldPublicDirectory();
        $this->call('vendor:publish', [
            '--provider' => 'Xpyct\SqlViewer\SqlViewerServiceProvider',
            '--tag' => 'sql-viewer-assets',
            '--force' => true,
        ]);
    }

    protected function clearOldPublicDirectory()
    {
        $publicPath = public_path('vendor/sql-viewer');
        if (is_dir($publicPath)) {
            $this->deleteDirectory($publicPath);
        }
    }

    protected function deleteDirectory($dir): void
    {
        if (!is_dir($dir)) {
            return;
        }
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? $this->deleteDirectory("$dir/$file") : unlink("$dir/$file");
        }
        rmdir($dir);
    }
}
