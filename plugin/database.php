<?php
	class Database {
		private $pdo;

		public function __construct($env) {
			$this->connect($env);
		}

		private function connect($env) {
			try {
				$dsn = "mysql:host={$env->dbHost};port={$env->dbPort};dbname={$env->dbName};charset=utf8mb4";
				$this->pdo = new PDO($dsn, $env->dbUsername, $env->dbPassword);
				$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			} catch (PDOException $e) {
				die("Connection failed: " . $e->getMessage());
			}
		}

		public function connection() {
			return $this->pdo;
		}
	}