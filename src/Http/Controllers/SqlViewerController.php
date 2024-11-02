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
            } elseif (stripos($query, 'update') !== false) {
                DB::update($query);
            } elseif (stripos($query, 'insert') !== false) {
                DB::insert($query);
            } elseif (stripos($query, 'delete') !== false) {
                DB::delete($query);
            } else {
                DB::statement($query);
            }

            // if we have results, return them
            if (isset($results)) {
                return response()->json([
                    'success' => true,
                    'columns' => empty($results) ? [] : array_keys((array)$results[0]),
                    'rows' => $results
                ]);
            }

            return response()->json(['success' => true, 'columns' => [], 'rows' => []]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
