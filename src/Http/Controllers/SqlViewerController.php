<?php

namespace Xpyct\SqlViewer\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SqlViewerController extends Controller
{
    public function index()
    {
        return view('sql-viewer::index');
    }

    public function getTables()
    {
        try {
            $isSqlite = config('database.default') === 'sqlite';
            if($isSqlite) {
                $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
            }else{
                $tables = DB::select('SHOW TABLES;');
            }
            $tables = collect($tables)->map(function ($table) {
                return [
                    'name' => $table->name ?? '',
                    'columns' => Schema::getColumns($table->name),
                ];
            });
            return response()->json(['tables' => $tables]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
