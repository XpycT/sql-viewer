<?php

use Illuminate\Support\Facades\Route;
use Xpyct\SqlViewer\Http\Controllers\SqlViewerController;

Route::get('/', [SqlViewerController::class, 'index'])
    // ->middleware(['can:viewSqlViewer'])
    ->name('sql-viewer.index');

Route::get('/tables', [SqlViewerController::class, 'getTables'])->name('sql-viewer.tables');

Route::post('/execute', [SqlViewerController::class, 'executeQuery'])->name('sql-viewer.execute');
