<?php

namespace Xpyct\SqlViewer\Http\Controllers;

use Illuminate\Routing\Controller;

class SqlViewerController extends Controller
{
    public function index()
    {
        return view('sql-viewer::index');
    }
}
