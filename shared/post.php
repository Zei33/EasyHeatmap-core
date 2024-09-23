<?php
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

if ($contentType === "application/json" || $contentType === "application/gzip") {
    $content = trim(file_get_contents("php://input"));

    if ($contentType === "application/gzip") {
        $content = gzdecode($content);
    }

    $decoded = json_decode($content, true);
    if (is_array($decoded)) {
        $_POST = $decoded;
    }
}