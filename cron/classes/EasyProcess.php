<?php
class EasyUnprocessed {
	public $session_id;
	public $analytics_id;
	public $created_date;
	
	private $ES;

	public $files = [];

	public function __construct($ES) {
		$this->ES = $ES;
		$this->files = $this->findFiles();
	}

	private function findFiles() {
		$base = $this->ES->getSetting("data_directory", "/var/www/ehm-data");
		$dir = rtrim($base, "/") . "/unprocessed/" . $this->session_id;
		$files = glob($dir . "/*.ehm");

		$fileNames = array_map("basename", $files);
		sort($fileNames, SORT_NATURAL | SORT_FLAG_CASE);

		return $fileNames;
	}

	// Decode from base64 to gzip to JSON
	public function decode() {
		$data = [];
		foreach ($this->files as $file) {
			$path = $this->ES->getSetting("data_directory", "/var/www/ehm-data") . "/unprocessed/" . $this->session_id . "/" . $file;
			$contents = file_get_contents($path);
			$decoded = base64_decode($contents);
			$decoded = gzdecode($decoded);
			$decoded = json_decode($decoded, true);
			$data[] = $decoded;
		}
		return $data;
	}
}

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