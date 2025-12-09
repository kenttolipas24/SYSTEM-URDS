<?php
require_once "../config/db.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = $_POST["email"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([":email" => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo "invalid";
        exit;
    }

    if (password_verify($password, $user["password_hash"])) {
        // Prevent session fixation
        session_regenerate_id(true);

        $_SESSION["user_id"] = $user["id"];
        $_SESSION["role"] = $user["role"];

        echo "success";
    } else {
        echo "invalid";
    }
}
?>
