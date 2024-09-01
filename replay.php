<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="/styles/replayer.css">
		<script src="/scripts/EasyEvents.js?v=<?php echo filemtime('scripts/EasyEvents.js'); ?>"></script>
		<script src="/scripts/EasyDecompress.js?v=<?php echo filemtime('scripts/EasyDecompress.js'); ?>"></script>
		<script src="/scripts/EasyReplayer.js?v=<?php echo filemtime('scripts/EasyReplayer.js'); ?>"></script>
	</head>

	<body>
		<script>
			const replay = new EasyReplayer();
			
			const styles = "<?php require("styles.php") ?>";
			const elements = "<?php require("elements.php") ?>";
			const scripts = "<?php require("scripts.php") ?>";
			const recording = "<?php require("recording.php") ?>";

			replay.load({ styles, elements, scripts, recording }, true);
		</script>
	</body>
</html>
