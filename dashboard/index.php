<?php 
	require_once("classes/EasyLoc.php");
	require_once("classes/EasySettings.php");
?>
<!DOCTYPE html>
<html class="dark h-full bg-black">
	<head>
		<link rel="stylesheet" href="/styles/processed/dashboard.css">
		<script>
			window.EasyHeatmap = {};
			window.EasyHeatmap.API = "/dashboard/api";
		</script>
		<script src="/dashboard/scripts/EasySettings.js?v=<?php echo filemtime('./scripts/EasySettings.js'); ?>"></script>
		<?php require("dynamic/settings-data.php"); ?>
		<script src="/dashboard/scripts/EasyDashboard.js?v=<?php echo filemtime('./scripts/EasyDashboard.js'); ?>"></script>
		<script src="/dashboard/scripts/EasyLoc.js?v=<?php echo filemtime('./scripts/EasyLoc.js'); ?>"></script>
		<?php require("dynamic/localisation-data.php"); ?>
	</head>

	<body class="h-full">
		<easy-dashboard class="text-slate-400 bg-slate-900 w-full h-full overflow-y-auto">
			<?php require("top-bar.php"); ?>
			<?php require("side-bar.php"); ?>
			<?php require("main-content.php"); ?>
		</easy-dashboard>
		<script>
			window.EasyHeatmap.dashboard = new EasyDashboard("/dashboard", "easy-dashboard");
			window.EasyHeatmap.settings = new EasySettings();
			window.EasyHeatmap.dashboard.initialNavigation();
		</script>
	</body>
</html>
