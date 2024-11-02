<?php

namespace Xpyct\SqlViewer\Services;

use PHPSQLParser\PHPSQLParser;
use PHPSQLParser\PHPSQLCreator;

class SqlQueryWrapper
{
    private PHPSQLParser $parser;
    private PHPSQLCreator $creator;
    private int $maxLimit = 100;
    private array $parsed;

    public function __construct()
    {
        $this->parser = new PHPSQLParser();
        $this->creator = new PHPSQLCreator();
    }

    public function process(string $sql): string
    {
        $this->parsed = $this->parser->parse($sql);
        $this->processLimit();

        return $this->creator->create($this->parsed);
    }

    public function setMaxLimit(int $limit): self
    {
        $this->maxLimit = $limit;
        return $this;
    }

    private function processLimit(): void
    {
        // if LIMIT not found, add it
        if (!isset($this->parsed['LIMIT'])) {
            $this->addLimit($this->maxLimit);
            return;
        }

        $currentLimit = $this->getCurrentLimit();
        if ($currentLimit > $this->maxLimit) {
            $this->updateLimit($this->maxLimit);
        }
    }

    private function getCurrentLimit(): int
    {
        if(!isset($this->parsed['LIMIT']['rowcount'])) {
            return 0;
        }

        return $this->parsed['LIMIT']['rowcount'];
    }

    private function addLimit(int $limit): void
    {
        $this->parsed['LIMIT'] = [
            'offset' => 0,
            'rowcount' => $limit,
        ];
    }

    private function updateLimit(int $limit): void
    {
        $this->parsed['LIMIT']['rowcount'] = $limit;
    }

    public function getParsedStructure(): array
    {
        return $this->parsed;
    }

}
