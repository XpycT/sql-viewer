<?php

use Illuminate\Support\Facades\Route;
use Xpyct\SqlViewer\Http\Controllers\SqlViewerController;

Route::get('/', [SqlViewerController::class, 'index'])
    // ->middleware(['can:viewSqlViewer'])
    ->name('sql-viewer.index');
