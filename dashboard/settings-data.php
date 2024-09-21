<script>
	<?php
		require_once("../shared/environment.php");
		require_once("../shared/database.php");
		require("classes/EasySettings.php");

		$pdo = $database->connection();
		$ES = new EasySettings($pdo, $env->dbTablePrefix);
	?>
	window.EasyHeatmap.ES = <?php echo json_encode($ES->getSettings()); ?>;
</script>