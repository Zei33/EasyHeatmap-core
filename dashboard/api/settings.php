<?php
require_once("../../shared/classes/EasySettings.php");

require_once("../../shared/post.php");

foreach ($_POST as $key => $value) {
	$ES->setSetting($key, $value);
}

echo json_encode($ES->getSettings(true));