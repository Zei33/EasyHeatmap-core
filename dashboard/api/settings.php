<?php
require_once("../classes/EasySettings.php");

// Check Content-Type header
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

if ($contentType === "application/json") {
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, true);
    if (is_array($decoded)) {
        $_POST = $decoded;
    }
}

error_log(json_encode($_POST));
foreach ($_POST as $key => $value) {
	error_log("Setting $key to $value");
	$ES->setSetting($key, $value);
}

echo json_encode($ES->getSettings());