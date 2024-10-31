<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SQL Viewer</title>
    @viteReactRefresh()
    @vite(['resources/css/app.css', 'resources/js/main.tsx'], 'vendor/sql-viewer')
</head>
<body>
    <div id="root"></div>
</body>
</html>
