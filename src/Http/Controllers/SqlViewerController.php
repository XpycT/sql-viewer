<?php

namespace Xpyct\SqlViewer\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;

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

    public function executeQuery(Request $request)
    {
        try {
            $query = $request->input('query');
            $results = DB::select($query);

            if (empty($results)) {
                return response()->json([
                    'columns' => [],
                    'rows' => []
                ]);
            }

            $firstRow = $results[0];
            $columns = array_keys((array)$firstRow);

            return response()->json([
                'columns' => $columns,
                'rows' => $results
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
