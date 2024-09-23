<?php
require_once("../shared/database.php");
require_once("classes/EasyProcess.php");

$EP = new EasyProcess($pdo, $env, $ES);