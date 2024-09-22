<?php 
require_once(__DIR__ . "/../../shared/database.php");
/**
 * Class EasySettings
 * Handles settings management.
 */
class EasySettings {
	/**
	 * @var PDO The PDO instance for database interaction.
	 */
	private $pdo;

	/**
	 * @var string The prefix for the settings table.
	 */
	private $prefix;

	/**
	 * @var array The cached settings.
	 */
	private $settings = [];

	/**
	 * EasySettings constructor.
	 *
	 * @param PDO $pdo The PDO instance for database interaction.
	 * @param string $prefix The prefix for the settings table.
	 */
	public function __construct(PDO $pdo, $env) {
		$this->pdo = $pdo;
		$this->prefix = $env->dbTablePrefix;
	}

	private function loadSettings($fresh = false) {
		if ($fresh || empty($this->settings)) {
			$query = $this->pdo->prepare("SELECT `key`, `value` FROM {$this->prefix}settings");
			$query->execute();
			$this->settings = $query->fetchAll(PDO::FETCH_KEY_PAIR);
		}
	}
	
	/**
	 * Retrieves settings from the database.
	 *
	 * @param bool $fresh Whether to fetch fresh settings from the database.
	 * @return array The settings.
	 */
	public function getSettings($fresh = false) {
		$this->loadSettings($fresh);
		
		return $this->settings;
	}

	public function setSetting($key, $value) {
		$this->loadSettings();
		$query = $this->pdo->prepare("UPDATE {$this->prefix}settings SET `value` = :value WHERE `key` = :key");
		$query->execute([
			":key" => $key,
			":value" => strlen($value) ? $value : null
		]);
		$this->settings[$key] = $value;

		return $this->settings;
	}
}

$ES = new EasySettings($pdo, $env);