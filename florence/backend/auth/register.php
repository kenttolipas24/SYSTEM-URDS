<?php
require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $first = $_POST["first_name"];
    $last = $_POST["last_name"];
    $email = $_POST["email"];
    $institution = $_POST["institution"];
    $role = $_POST["role"];
    $password = $_POST["password"];

    // Hash the password securely
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Insert into database
    $query = "INSERT INTO users 
              (first_name, last_name, email, institution, role, password_hash)
              VALUES 
              (:first, :last, :email, :institution, :role, :hash)";

    $stmt = $conn->prepare($query);

    try {
        $stmt->execute([
            ":first" => $first,
            ":last" => $last,
            ":email" => $email,
            ":institution" => $institution,
            ":role" => $role,
            ":hash" => $hash
        ]);

        echo "success";

    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo "email_exists";
        } else {
            echo "error";
        }
    }
}
?>
