<?php
	require_once("environment.php");
	require("database.php");
	require("EasySetup.php");

	echo "Easy Heatmap Setup\n";

	$short_options = 'dp:c';
	$long_options = ['drop', 'prefix:', 'create'];

	$options = getopt($short_options, $long_options);

	$drop = isset($options['d']) || isset($options['drop']);
	$create = isset($options['c']) || isset($options['create']);

	if (isset($options['p'])) {
		$env->dbTablePrefix = $options['p'];
	} elseif (isset($options['prefix'])) {
		$env->dbTablePrefix = $options['prefix'];
	}
	echo "Table prefix: {$env->dbTablePrefix}\n";

	$database = new Database($env);
	$pdo = $database->connection();
	$setup = new EasySetup($pdo, $env->dbTablePrefix);

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

	echo "Setup complete.\n";