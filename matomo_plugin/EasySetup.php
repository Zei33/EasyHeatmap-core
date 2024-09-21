<?php
/**
 * Class EasySetup
 *
 * A class for setting up the database tables and initial data for an application.
 *
 * This class provides methods to create, drop, and populate various tables required by the application.
 */
class EasySetup {
    /**
     * The PDO instance for database access.
     *
     * @var PDO
     */
    private $pdo;

    /**
     * The prefix for database tables.
     *
     * @var string
     */
    private $prefix;

    /**
     * EasySetup constructor.
     *
     * Initializes the database connection and sanitizes the table prefix.
     *
     * @param PDO    $pdo    The PDO instance for database access.
     * @param string $prefix The prefix for database tables. Default is 'ehm_'.
     */
    public function __construct(PDO $pdo, $prefix = 'ehm_') {
        $this->pdo = $pdo;
        $this->prefix = preg_replace('/[^a-zA-Z0-9_]/', '', $prefix);
    }

    /**
     * Drops a table if it exists.
     *
     * @param string $table The name of the table to drop.
     *
     * @return void
     */
    public function dropTable($table) {
        $query = "DROP TABLE IF EXISTS `{$this->prefix}{$table}`";
        
        $this->pdo->exec($query);
    }

    /**
     * Creates the settings table.
     *
     * @return void
     */
    public function createSettingsTable() {
        $query = "
            CREATE TABLE `{$this->prefix}settings` (
                `key` varchar(32) NOT NULL,
                `value` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
                `category` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
                `description` text,
                PRIMARY KEY (`key`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Populates the settings table with initial data.
     *
     * @return void
     */
    public function fillSettingsTable() {
        $query = "
            INSERT INTO `{$this->prefix}settings` (`key`, `value`, `category`, `description`)
            VALUES (:key, :value, :category, :description)
        ";
        $stmt = $this->pdo->prepare($query);

        $data = [
            ['key' => 'breakpoint_preset', 'value' => 'tailwind', 'category' => 'settings', 'description' => 'Which preset is being used for the settings menu.'],
            ['key' => 'capture_keyboard', 'value' => '1', 'category' => 'record', 'description' => 'Capture keyboard interactions during recording.'],
            ['key' => 'current_breakpoint_version', 'value' => '0', 'category' => 'heatmap', 'description' => 'What settings should heatmaps currently use when recording.'],
            ['key' => 'custom_base_url', 'value' => NULL, 'category' => 'record', 'description' => 'Override page URL when rewriting relative URLs.'],
            ['key' => 'element_path', 'value' => './data/elements', 'category' => 'settings', 'description' => 'Where elements should be stored.'],
            ['key' => 'hard_record_external', 'value' => '0', 'category' => 'record', 'description' => 'Record external resources entirely instead of using remote links.'],
            ['key' => 'heatmap_resolution', 'value' => '1', 'category' => 'heatmap', 'description' => 'Hours that heatmap data will be grouped into.'],
            ['key' => 'ignore_class', 'value' => NULL, 'category' => 'record', 'description' => 'Do not record key strokes while an element with this class is selected.'],
            ['key' => 'mouse_frequency', 'value' => '10', 'category' => 'record', 'description' => 'Time in milliseconds between each mouse position recording.'],
            ['key' => 'mouse_precision', 'value' => '4', 'category' => 'heatmap', 'description' => 'Pixel size of grid spaces that mouse coordinates are recorded in.'],
            ['key' => 'recording_path', 'value' => './data/recordings', 'category' => 'settings', 'description' => 'Where recordings should be stored.'],
            ['key' => 'scripts_path', 'value' => './data/scripts', 'category' => 'settings', 'description' => 'Where scripts should be stored.'],
            ['key' => 'styles_path', 'value' => './data/styles', 'category' => 'settings', 'description' => 'Where styles should be stored.'],
            ['key' => 'language', 'value' => 'en', 'category' => 'settings', 'description' => 'Which localisation the dashboard should use.']
        ];

        foreach ($data as $row) {
            $stmt->execute($row);
        }
    }

    /**
     * Creates the sessions table.
     *
     * @return void
     */
    public function createSessionsTable() {
        $query = "
            CREATE TABLE `{$this->prefix}sessions` (
                `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                `created_date` datetime DEFAULT NULL,
                PRIMARY KEY (`id`),
                KEY `IX_{$this->prefix}sessions_created_date` (`created_date`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Creates the breakpoints table.
     *
     * @return void
     */
    public function createBreakpointsTable() {
        $query = "
            CREATE TABLE `{$this->prefix}breakpoints` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `label` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
                `starting_pixels` int unsigned NOT NULL,
                `version` int unsigned NOT NULL,
                PRIMARY KEY (`id`),
                KEY `IX_{$this->prefix}breakpoints_version` (`version`),
                KEY `IX_{$this->prefix}breakpoints_start_pixels` (`starting_pixels`)
            ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Populates the breakpoints table with initial data.
     *
     * @return void
     */
    public function fillBreakpointsTable() {
        $query = "
            INSERT INTO `{$this->prefix}breakpoints` (`id`, `label`, `starting_pixels`, `version`)
            VALUES (:id, :label, :starting_pixels, :version)
        ";
        $stmt = $this->pdo->prepare($query);

        $data = [
            ['id' => 1, 'label' => 'Extra Small', 'starting_pixels' => 0, 'version' => 0],
            ['id' => 2, 'label' => 'Small', 'starting_pixels' => 640, 'version' => 0],
            ['id' => 3, 'label' => 'Medium', 'starting_pixels' => 768, 'version' => 0],
            ['id' => 4, 'label' => 'Large', 'starting_pixels' => 1024, 'version' => 0],
            ['id' => 5, 'label' => 'Extra Large', 'starting_pixels' => 1280, 'version' => 0],
            ['id' => 6, 'label' => 'XX Large', 'starting_pixels' => 1536, 'version' => 0]
        ];

        foreach ($data as $row) {
            $stmt->execute($row);
        }
    }

    /**
     * Creates the heatmaps table.
     *
     * @return void
     */
    public function createHeatmapsTable() {
        $query = "
            CREATE TABLE `{$this->prefix}heatmaps` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `path` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                `mouse_precision` int unsigned NOT NULL,
                `breakpoint_version` int unsigned NOT NULL,
                `created_date` datetime NOT NULL,
                `hours_resolution` int unsigned NOT NULL,
                `mouse_total` int unsigned NOT NULL DEFAULT '0',
                PRIMARY KEY (`id`),
                KEY `FK_{$this->prefix}heatmaps_breakpoint_version` (`breakpoint_version`),
                KEY `IX_{$this->prefix}heatmaps_created_date` (`created_date`),
                KEY `IX_{$this->prefix}heatmaps_hours_resolution` (`hours_resolution`),
                CONSTRAINT `FK_{$this->prefix}heatmaps_breakpoint_version` FOREIGN KEY (`breakpoint_version`) REFERENCES `{$this->prefix}breakpoints` (`version`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Creates the mouse table.
     *
     * @return void
     */
    public function createMouseTable() {
        $query = "
            CREATE TABLE `{$this->prefix}mouse` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `heatmap_id` int unsigned DEFAULT NULL,
                `breakpoint_id` int unsigned DEFAULT NULL,
                `x` int unsigned DEFAULT NULL,
                `y` int unsigned DEFAULT NULL,
                `count` int unsigned DEFAULT NULL,
                PRIMARY KEY (`id`),
                KEY `FK_{$this->prefix}mouse_heatmap_id` (`heatmap_id`),
                CONSTRAINT `FK_{$this->prefix}mouse_breakpoint_id` FOREIGN KEY (`id`) REFERENCES `{$this->prefix}breakpoints` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `FK_{$this->prefix}mouse_heatmap_id` FOREIGN KEY (`heatmap_id`) REFERENCES `{$this->prefix}heatmaps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Creates the keyboard table.
     *
     * @return void
     */
    public function createKeyboardTable() {
        $query = "
            CREATE TABLE `{$this->prefix}keyboard` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `heatmap_id` int unsigned NOT NULL,
                `key` int NOT NULL,
                `count` int unsigned NOT NULL,
                PRIMARY KEY (`id`),
                KEY `FK_{$this->prefix}keyboard_heatmap_id` (`heatmap_id`),
                CONSTRAINT `FK_{$this->prefix}keyboard_heatmap_id` FOREIGN KEY (`heatmap_id`) REFERENCES `{$this->prefix}heatmaps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Creates the scroll table.
     *
     * @return void
     */
    public function createScrollTable() {
        $query = "
            CREATE TABLE `{$this->prefix}scroll` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `heatmap_id` int DEFAULT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Creates the recordings table.
     *
     * @return void
     */
    public function createRecordingsTable() {
        $query = "
            CREATE TABLE `{$this->prefix}recordings` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                `part` int unsigned NOT NULL,
                `path` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                `display_width` int unsigned NOT NULL,
                `display_height` int unsigned NOT NULL,
                `created_date` datetime NOT NULL,
                `recording_length` int unsigned NOT NULL,
                PRIMARY KEY (`id`),
                KEY `FK_{$this->prefix}recordings_session_id` (`session_id`),
                KEY `IX_{$this->prefix}recordings_created_date` (`created_date`),
                KEY `IX_{$this->prefix}recordings_path` (`path`),
                CONSTRAINT `FK_{$this->prefix}recordings_session_id` FOREIGN KEY (`session_id`) REFERENCES `{$this->prefix}sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Creates the elements table.
     *
     * @return void
     */
    public function createElementsTable() {
        $query = "
            CREATE TABLE `{$this->prefix}elements` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                `hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                PRIMARY KEY (`id`),
                KEY `FK_{$this->prefix}elements_session_id` (`session_id`),
                CONSTRAINT `FK_{$this->prefix}elements_session_id` FOREIGN KEY (`session_id`) REFERENCES `{$this->prefix}sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Creates the scripts table.
     *
     * @return void
     */
    public function createScriptsTable() {
        $query = "
            CREATE TABLE `{$this->prefix}scripts` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                `hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                PRIMARY KEY (`id`),
                KEY `FK_{$this->prefix}breakpoints_session_id` (`session_id`),
                CONSTRAINT `FK_{$this->prefix}breakpoints_session_id` FOREIGN KEY (`session_id`) REFERENCES `{$this->prefix}sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }

    /**
     * Creates the styles table.
     *
     * @return void
     */
    public function createStylesTable() {
        $query = "
            CREATE TABLE `{$this->prefix}styles` (
                `id` int unsigned NOT NULL AUTO_INCREMENT,
                `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                `hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                PRIMARY KEY (`id`),
                KEY `FK_{$this->prefix}styles_session_id` (`session_id`),
                CONSTRAINT `FK_{$this->prefix}styles_session_id` FOREIGN KEY (`session_id`) REFERENCES `{$this->prefix}sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ";

        $this->pdo->exec($query);
    }
}
