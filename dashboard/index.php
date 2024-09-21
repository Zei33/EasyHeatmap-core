<?php 
	require_once("../shared/environment.php");
	require_once("../shared/database.php");
	require("classes/EasyLoc.php");
	$pdo = $database->connection();
	$EL = new EasyLoc($pdo, $env->dbTablePrefix);
?>
<!DOCTYPE html>
<html class="dark h-full bg-black">
	<head>
		<link rel="stylesheet" href="/styles/processed/dashboard.css">
		<script src="/scripts/dashboard/EasySettings.js?v=<?php echo filemtime('../scripts/dashboard/EasySettings.js'); ?>"></script>
		<script src="/scripts/dashboard/EasyDashboard.js?v=<?php echo filemtime('../scripts/dashboard/EasyDashboard.js'); ?>"></script>
		<script src="/scripts/dashboard/EasyLoc.js?v=<?php echo filemtime('../scripts/dashboard/EasyLoc.js'); ?>"></script>
		<?php require("localisation-data.php"); ?>
		<?php require("settings-data.php"); ?>
	</head>

	<body class="h-full">
		<easy-dashboard class="text-slate-400 bg-slate-900 w-full h-full overflow-y-auto">
			<?php require("top-bar.php"); ?>
			<?php require("side-bar.php"); ?>
			<?php require("main-content.php"); ?>
		</easy-dashboard>

		<script>
			const dashboard = new EasyDashboard("/dashboard", "easy-dashboard");
		</script>
	</body>
</html>
