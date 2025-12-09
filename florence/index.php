<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>University Research and Development System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="icon" type="image/png" href="assets/images/UEP-logo.png">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/navbar.css">
    <link rel="stylesheet" href="css/signup-login.css">

</head>
<body>
<!-- main content -->
    <!-- Include Navbar -->
    <div id="navbar-placeholder">
        <?php include __DIR__ . '/components/navbar.html'; ?>
    </div>

    <div class="main-container">
        <div class="watermark"><img src="assets/images/UEP-logo.png"></div>
        
        <div class="left-section">
            <h1 class="title">UNIVERSITY RESEARCH AND DEVELOPMENT SYSTEM</h1>
            
            <div class="features">
                <div class="feature-item">
                    <div class="check-icon">✓</div>
                    <div class="feature-content">
                        <h3>Easy Registration</h3>
                        <p>Quick and simple account creation process</p>
                    </div>
                </div>
                <div class="feature-item">
                    <div class="check-icon">✓</div>
                    <div class="feature-content">
                        <h3>Secure Access</h3>
                        <p>Your data is protected with industry standards</p>
                    </div>
                </div>
                <div class="feature-item">
                    <div class="check-icon">✓</div>
                    <div class="feature-content">
                        <h3>Multiple Roles</h3>
                        <p>Choose from different user roles and responsibilities</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="right-section">
            <div id="access_portal-placeholder">
                <?php include __DIR__ . '/components/login-signup.html'; ?>
            </div>
        </div>
    </div>

    <script src="js/login.js"></script>
    <script src="js/landing.js"></script>
    <script src="js/signup.js"></script>
</body>
</html>
