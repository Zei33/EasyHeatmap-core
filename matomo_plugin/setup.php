<?php
    // Include necessary files for environment settings and database connection
    require_once("../shared/database.php");
    require("EasySetup.php");

    // Output a message indicating the start of the setup process
    echo "Easy Heatmap Setup\n";

    // Define short and long options for command-line arguments
    $short_options = 'dp:cb:s';
    $long_options = ['drop', 'prefix:', 'create', 'basedir:', 'skipdir'];

    // Parse command-line options
    $options = getopt($short_options, $long_options);

    // Determine if 'drop' or 'create' options are set
    $drop = isset($options['d']) || isset($options['drop']);
    $create = isset($options['c']) || isset($options['create']);

    // Set the table prefix based on provided options
    if (isset($options['p'])) {
        $env->dbTablePrefix = $options['p'];
    } elseif (isset($options['prefix'])) {
        $env->dbTablePrefix = $options['prefix'];
    }

	// Set the base directory based on provided options
	$baseDirectory = isset($options['b']) ? $options['b'] : (isset($options['basedir']) ? $options['basedir'] : '/var/www/ehm-data');
	
	// Relative paths are assumed to be relative to /var/www
	if ($baseDirectory[0] !== '/') {
		$baseDirectory = '/var/www/' . $baseDirectory;
	}

    // Output the table prefix being used
    echo "Table prefix: {$env->dbTablePrefix}\n";

    // Establish a database connection and initialize the EasySetup class
    $setup = new EasySetup($pdo, $env->dbTablePrefix);

    // If the 'drop' option is set, drop existing tables
    if ($drop) {
        echo "Dropping tables...\n";
        $setup->dropTable('elements');
        $setup->dropTable('scripts');
        $setup->dropTable('styles');
        $setup->dropTable('recordings');

        $setup->dropTable('mouse');
        $setup->dropTable('keyboard');
        $setup->dropTable('scroll');
        $setup->dropTable('heatmaps');

        $setup->dropTable('breakpoints');

        $setup->dropTable('sessions');

        $setup->dropTable('settings');
        echo "Tables dropped.\n";
    } else {
		echo "Skipping table drop.\n";
	}

    // If the 'create' option is set, create necessary tables and populate them
    if ($create) {
        echo "Creating tables...\n";
        $setup->createSettingsTable();
        $setup->fillSettingsTable([
			'data_directory' => $baseDirectory
		]);
        
        $setup->createSessionsTable();
        
        $setup->createBreakpointsTable();
        $setup->fillBreakpointsTable();

        $setup->createHeatmapsTable();
        $setup->createMouseTable();
        $setup->createKeyboardTable();
        $setup->createScrollTable();

        $setup->createRecordingsTable();
        $setup->createElementsTable();
        $setup->createScriptsTable();
        $setup->createStylesTable();
        echo "Tables created.\n";
    } else {
		echo "Skipping table creation.\n";
	}

	// Create data directories and set permissions.
	if (isset($options['s']) || isset($options['skipdir'])) {
		echo "Skipping directory creation.\n";
	} else {
		echo "Creating data directories...\n";
		$directories = [
			$baseDirectory,
			$baseDirectory . '/unprocessed',
			$baseDirectory . '/recordings',
			$baseDirectory . '/scripts',
			$baseDirectory . '/styles',
			$baseDirectory . '/elements',
		];
	
		foreach ($directories as $directory) {
			if (!is_dir($directory)) {
				mkdir($directory, 0750, true);
			}
	
			chmod($directory, 0750);
		}
		echo "Data directories created.\n";
	}

    // Output a message indicating the setup process is complete
    echo "Setup complete.\n";
