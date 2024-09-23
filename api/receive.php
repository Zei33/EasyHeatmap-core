<?php
require_once("../shared/database.php");
require_once("../shared/classes/EasySettings.php");

header("Access-Control-Allow-Origin: " . $env->siteURL);
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start by checking validity of the request.
if (!isset($_GET["s"])) {
	error_log("Session ID not provided.");
	http_response_code(400);
	exit;
}

if (isset($_GET["s"])) {
	if (strlen($_GET["s"]) != 20) {
		error_log("Session ID must be 20 characters long.");
		http_response_code(400);
		exit;
	} else if (!preg_match("/^[a-zA-Z0-9]+$/", $_GET["s"])) {
		error_log("Session ID must be alphanumeric.");
		http_response_code(400);
		exit;
	}
}

$content = trim(file_get_contents("php://input"));

$unprocessed_dir = $ES->getSetting("unprocessed_path", "../data/unprocessed");
$dir = rtrim($unprocessed_dir, "/") . "/" . $_GET["s"];
$path = $dir . "/" . time() . ".gz";

if (!is_dir($dir)) {
	mkdir($dir, 0777, true);
}

file_put_contents($path, $content);

http_response_code(200);
exit;