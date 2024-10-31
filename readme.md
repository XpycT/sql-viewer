Опубликуйте конфигурацию и ассеты:

php artisan vendor:publish --provider="Xpyct\SqlViewer\SqlViewerServiceProvider" --tag="sql-viewer-config"
php artisan vendor:publish --provider="Xpyct\SqlViewer\SqlViewerServiceProvider" --tag="sql-viewer-assets"

Для сборки frontend части:

cd packages/xpyct/sql-viewer
npm install
npm run build
