<?php
class EasyProcess {
	private $pdo;
	private $prefix;
	private $ES;

	private $unprocessed = [];

	public function __construct(PDO $pdo, $env, $ES) {
		$this->pdo = $pdo;
		$this->prefix = $env->dbTablePrefix;
		$this->ES = $ES;
	}

	private function loadUnprocessed() {
		$query = $this->pdo->prepare("
			SELECT 
				`session_id`, 
				`analytics_id`, 
				`created_date` 
			FROM 
				{$this->prefix}unprocessed
			WHERE
				`updated_date` >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
		");
		$query->execute();
		$this->unprocessed = $query->fetchAll(PDO::FETCH_CLASS, "EasyUnprocessed", [$this->ES]);
	}

	public function process() {
		$this->loadUnprocessed();

		foreach ($this->unprocessed as $recording) {
			$data = $recording->decode();
			echo json_encode($data, JSON_PRETTY_PRINT);
		}
	}
}