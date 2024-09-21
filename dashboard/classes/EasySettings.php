<?php 
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
		public function __construct(PDO $pdo, $prefix = 'ehm_') {
			$this->pdo = $pdo;
			$this->prefix = $prefix;
		}

		/**
		 * Retrieves settings from the database.
		 *
		 * @param bool $fresh Whether to fetch fresh settings from the database.
		 * @return array The settings.
		 */
		public function getSettings($fresh = false) {
			if ($fresh || empty($this->settings)) {
				$query = $this->pdo->prepare("SELECT * FROM {$this->prefix}settings");
				$query->execute();
				$this->settings = $query->fetchAll(PDO::FETCH_ASSOC);
			}
			
			return $this->settings;
		}
	}