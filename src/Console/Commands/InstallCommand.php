<?php

namespace Xpyct\SqlViewer\Console\Commands;

use Illuminate\Console\Command;

class InstallCommand extends Command
{
    protected $signature = 'sql-viewer:install';
    protected $description = 'Install the SQL Viewer package';

    public function handle()
    {
        $this->publishConfiguration();
        $this->publishAssets();

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
        $this->call('vendor:publish', [
            '--provider' => 'Xpyct\SqlViewer\SqlViewerServiceProvider',
            '--tag' => 'sql-viewer-assets',
            '--force' => true,
        ]);
    }
}
