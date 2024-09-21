<?php
    // Include necessary files for environment settings and database connection
    require_once("../shared/environment.php");
    require_once("../shared/database.php");
    require("EasySetup.php");

    // Output a message indicating the start of the setup process
    echo "Easy Heatmap Setup\n";

    // Define short and long options for command-line arguments
    $short_options = 'dp:c';
    $long_options = ['drop', 'prefix:', 'create'];

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

    // Output the table prefix being used
    echo "Table prefix: {$env->dbTablePrefix}\n";

    // Establish a database connection and initialize the EasySetup class
    $pdo = $database->connection();
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
    }

    // If the 'create' option is set, create necessary tables and populate them
    if ($create) {
        echo "Creating tables...\n";
        $setup->createSettingsTable();
        $setup->fillSettingsTable();
        
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
    }

    // Output a message indicating the setup process is complete
    echo "Setup complete.\n";
