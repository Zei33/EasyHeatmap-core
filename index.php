<!DOCTYPE html>
<html>
	<head>
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<script src="/scripts/EasyEvents.js?v=<?php echo filemtime('scripts/EasyEvents.js'); ?>"></script>
		<script src="/scripts/EasyCompress.js?v=<?php echo filemtime('scripts/EasyCompress.js'); ?>"></script>
		<script src="/scripts/EasyRecorder.js?v=<?php echo filemtime('scripts/EasyRecorder.js'); ?>"></script>
		<script>
			const record = new EasyRecorder();

			setTimeout(() => {
				console.log(record.recording);
				record.data().then(data => console.log(data));
			}, 15000);
		</script>
		<script>
			var _paq = window._paq = window._paq || [];
			window._mtm = window._mtm || [];
			window._mtm.push(['enableDebugMode']);
			/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
			_paq.push(['trackPageView']);
			_paq.push(['enableLinkTracking']);
			(function() {
				var u="//matomo.zei.gg/";
				_paq.push(['setTrackerUrl', u+'matomo.php']);
				_paq.push(['setSiteId', '1']);
				var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
				g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
			})();
		</script>
		<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
	</head>

	<body>
		<span id="text-output"></span>
		<button type="button" class="btn btn-primary" id="button-1">Hello World</button>
		<button type="button" class="btn btn-success" id="button-2">Goodbye World</button>

		<script>
			$('#button-1').click(() => $('#text-output').html('<div>Hello World</div><div>Hello Moon</div>'));
			$('#button-2').click(() => $('#text-output').html('<div>Goodbye World</div>'));
		</script>

		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
	</body>
</html>
