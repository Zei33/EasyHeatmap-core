<?php
/**
 * This script receives data from the client and saves it to the server as an ehm file.
 */

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

// Check for matomo tracking cookie
// Find cookie starting with _pk_id
$matomo_id = null;
if (isset($_COOKIE)) {
	foreach ($_COOKIE as $key => $value) {
		if (strpos($key, "_pk_id") === 0) {
			$matomo_id = $value;
			break;
		}
	}
}

if ($matomo_id == null) {
	error_log("Matomo ID not found.");
	http_response_code(400);
	exit;
}

if ($matomo_id > 55) {
	error_log("Matomo ID too long.");
	http_response_code(400);
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

$base = $ES->getSetting("data_directory", "/var/www/ehm-data");
$dir = rtrim($base, "/") . "/unprocessed/" . $_GET["s"];
$path = $dir . "/" . time() . ".ehm";

if (!is_dir($dir)) {
	mkdir($dir, 0777, true);
}

file_put_contents($path, $content);

$query = "
	INSERT INTO {$env->dbTablePrefix}unprocessed (
		`session_id`, 
		`analytics_id`, 
		`created_date`, 
		`updated_date`
	) VALUES (
		:session_id, 
		:analytics_id, 
		NOW(), 
		NOW()
	) 
	ON DUPLICATE KEY UPDATE `updated_date` = NOW()
";
$query = $pdo->prepare($query);
$query->execute([
	":session_id" => $_GET["s"],
	":analytics_id" => $matomo_id
]);

exit;