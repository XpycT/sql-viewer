<?php

namespace Xpyct\SqlViewer\Services;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;

class DatabaseStructureService
{
    private function getConnection(): Connection
    {
        $dbType = config('database.default');
        $driver = match ($dbType) {
            'mysql', 'mariadb' => 'pdo_mysql',
            'pgsql' => 'pdo_pgsql',
            'sqlite' => 'pdo_sqlite',
            default => throw new \InvalidArgumentException("Unsupported database type: $dbType"),
        };
        $connectionParams = [
            'dbname' => config('database.connections.'.$dbType.'.database'),
            'user' => config('database.connections.'.$dbType.'.username', null),
            'password' => config('database.connections.'.$dbType.'.password', null),
            'host' => config('database.connections.'.$dbType.'.host'),
            'driver' => $driver,
        ];
        if ($dbType === 'sqlite') {
            $connectionParams['path'] = config("database.connections.$dbType.database");
        }
        $connection = DriverManager::getConnection($connectionParams);
        return $connection;
    }

    public function getDatabaseStructure(): array
    {
        $structure = [];
        $connection = $this->getConnection();
        $schemaManager = $connection->createSchemaManager();

        $tables = $schemaManager->listTables();
        foreach ($tables as $table) {
            $tableName = $table->getName();
            $structure[$tableName] = [];

            $columns = $table->getColumns();

            foreach ($columns as $column) {
                try{
                    $type_name = $column->getType()->getSQLDeclaration([], $connection->getDatabasePlatform());
                    // fix for long names
                    $type_name = match (get_class($column->getType())) {
                        \Doctrine\DBAL\Types\DateTimeType::class => 'TIMESTAMP',
                        default => $type_name
                    };
                }catch(\Throwable $e){
                    // some types are not supported by doctrine
                    $type_name = match (get_class($column->getType())) {
                        \Doctrine\DBAL\Types\StringType::class => 'VARCHAR',
                        default => '??',
                    };
                }
                $structure[$tableName][] = [
                    'name' => $column->getName(),
                    'type' => $column->getType(),
                    'type_name' => $type_name,
                    'length' => $column->getLength(),
                    'nullable' => !$column->getNotnull(),
                    'default' => $column->getDefault(),
                    'isPrimaryKey' => $table->getPrimaryKey()->getColumns() === [$column->getName()],
                    'isForeignKey' => $table->getForeignKeys() !== [],
                ];

            }
        }
        return $structure;
    }

    public function getTableColumns(string $tableName): array
    {
        $structore = $this->getDatabaseStructure();
        return $structore[$tableName];
    }
}
