<!DOCTYPE html>
<html class="dark h-full bg-black">
	<head>
		<link rel="stylesheet" href="/styles/processed/dashboard.css">
		<script src="/scripts/dashboard/EasySettings.js?v=<?php echo filemtime('../scripts/dashboard/EasySettings.js'); ?>"></script>
		<script src="/scripts/EasyDashboard.js?v=<?php echo filemtime('../scripts/EasyDashboard.js'); ?>"></script>
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
