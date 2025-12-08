<?php
require_once "../config/db.php";

// Fetch ENUM values from MySQL
$query = $conn->query("SHOW COLUMNS FROM users LIKE 'role'");
$row = $query->fetch(PDO::FETCH_ASSOC);

// Extract ENUM values
preg_match("/^enum\((.*)\)$/", $row['Type'], $matches);

$enum_values = [];
foreach (explode(",", $matches[1]) as $value) {
    $enum_values[] = trim($value, "'");
}

// Return JSON
header("Content-Type: application/json");
echo json_encode($enum_values);