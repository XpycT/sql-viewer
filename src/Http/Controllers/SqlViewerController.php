<?php

namespace Xpyct\SqlViewer\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Xpyct\SqlViewer\Services\DatabaseStructureService;
use PHPSQLParser\PHPSQLParser;
use PHPSQLParser\PHPSQLCreator;
use Xpyct\SqlViewer\Services\SqlQueryWrapper;

class SqlViewerController extends Controller
{

    public function index()
    {
        return view('sql-viewer::index');
    }

    public function getTables()
    {
        try {
            $service = new DatabaseStructureService();
            $tables = $service->getDatabaseStructure();
            return response()->json(['tables' => $tables]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function executeQuery(Request $request)
    {
        try {
            $query = $request->input('query');

            if (empty($query)) {
                return response()->json(['error' => 'Empty query'], 400);
            }

            $wrapper = new SqlQueryWrapper();
            $query = $wrapper
                ->setMaxLimit(config('sql-viewer.max_limit'))
                ->process($query);

            foreach (config('sql-viewer.forbidden_actions') as $forbiddenAction) {
                if (in_array(strtolower($forbiddenAction), array_map('strtolower', array_keys($wrapper->getParsedStructure())))) {
                    return response()->json(['error' => 'Forbidden action: ' . strtoupper($forbiddenAction)], 403);
                }
            }

            // Processing different types of queries
            $results = null;
            if (stripos($query, 'select') !== false) {
                $results = DB::select($query);
                $service = new DatabaseStructureService();
                $tableName = $wrapper->getTableName();
                $tableStructure = $service->getTableColumns($tableName);
                return response()->json([
                    'type' => 'SELECT',
                    'columns' => empty($results) ? [] : array_keys((array)$results[0]),
                    'rows' => $results,
                    'structure' => $tableStructure
                ]);
            } elseif (stripos($query, 'update') !== false) {
                $type = 'UPDATE';
                DB::update($query);
            } elseif (stripos($query, 'insert') !== false) {
                $type = 'INSERT';
                DB::insert($query);
            } elseif (stripos($query, 'delete') !== false) {
                $type = 'DELETE';
                DB::delete($query);
            } else {
                $type = 'STATEMENT';
                DB::statement($query);
            }

            return response()->json(['type' => $type]);

        } catch (\Exception $e) {
            return response()->json(['type' => 'ERROR', 'error' => $e->getMessage()], 500);
        }
    }
}
