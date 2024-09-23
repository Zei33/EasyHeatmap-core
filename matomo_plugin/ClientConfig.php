<?php 
	require_once("../shared/environment.php");
	require_once("../shared/classes/EasySettings.php"); 
?>
<script>
	window.EHM = {
		ct: <?php echo $ES->getSetting("chunk_time", "10"); ?>, // Chunk Time
		rs: "<?php echo $ES->getSetting("recording_strategy", "url"); ?>", // Recording Strategy
		
		// On Matomo, this is matomo_option -> option_name -> "piwikUrl"
		api: "<?php echo rtrim($env->apiURL, "/") . "/api/receive.php"; ?>" // URL to send recording to
	}

	EHM.r = new EasyRecorder();

	<?php 
		$strategy = $ES->getSetting("recording_strategy", "url");
		if ($strategy == "url" || $strategy == "url-query") {
			echo "EasyRecorder.start();";
		}
	?>
</script>