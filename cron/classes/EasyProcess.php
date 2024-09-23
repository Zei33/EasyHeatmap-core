<?php
class EasyProcess {
	public function __construct(PDO $pdo, $env, EasySettings $ES) {
		$this->pdo = $pdo;
		$this->prefix = $env->dbTablePrefix;
	}
}