<?php
// Simple session check endpoint — returns JSON with login status and role
session_start();

header('Content-Type: application/json');

$response = [
	'logged_in' => false,
	'user_id' => null,
	'role' => null
];

if (!empty($_SESSION['user_id'])) {
	$response['logged_in'] = true;
	$response['user_id'] = $_SESSION['user_id'];
	$response['role'] = isset($_SESSION['role']) ? $_SESSION['role'] : null;
}

echo json_encode($response);
?>
