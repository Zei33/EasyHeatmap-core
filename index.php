<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="/styles/test.css">
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<script src="/scripts/EasyEvents.js"></script>
		<script src="/scripts/EasyCompress.js"></script>
		<script src="/scripts/EasyRecorder.js"></script>
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
		<input type="text">
		<input type="text" id="important-input">
		<input type="text">
		<?php for ($i = 0; $i < 50; $i++) { ?>
			<p class="hello-worlds">Hello world <?=$i?></p>
		<?php } ?>

		<button type="button" class="btn btn-primary" id="my-button">Primary</button>

		<script>
			$(function(){
				$("#my-button").on("click", function(){
					$(".hello-worlds").remove();
					$("body").append("<p class='hello-worlds'><span>Bringing Back the Worlds</span></p>");

					setTimeout(() => {
						document.querySelectorAll(".hello-worlds").forEach((element, index) => {
							element.innerHTML += `FFF`;
						});
						setTimeout(() => {
							document.querySelectorAll(".hello-worlds").forEach((element, index) => {
								element.innerHTML += `AAA`;
							});
						}, 1000);
					}, 1000);
					// setTimeout(() => {
					// 	$("body").append("<p class='hello-worlds'>Hello world 50</p>");
					// 	$(".hello-worlds").addClass("text-danger");
					// 	setTimeout(() => {
					// 		$(".hello-worlds").removeClass("text-danger");
					// 		$("p").html("HAHAHAA");
					// 		setTimeout(() => {
					// 			$("p").prepend($(`<span class="text-success">PREPENDED</span>`));
					// 		}, 1000);
					// 	}, 1000);
					// }, 1000);
				});
			});
		</script>

		<script>
			const record = new EasyRecorder();

			setTimeout(() => {
				console.log(record.recording);
				record.data().then(data => console.log(data));
			}, 15000);
		</script>

		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
	</body>
</html>
