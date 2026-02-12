<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('SITE_NAME', 'Lost & Found Campus Network');
define('SITE_URL', 'http://localhost/lost and found/');

define('BASE_DIR', __DIR__ . '/');
define('DATA_DIR', BASE_DIR . 'data/');
define('UPLOAD_DIR', BASE_DIR . 'uploads/');
define('UPLOAD_URL', SITE_URL . 'uploads/');

define('MAX_FILE_SIZE', 5 * 1024 * 1024);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif']); 

define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123');

function isLoggedIn() {
    return isset($_SESSION['student_name']);
}

function isAdmin() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}


function redirect($url) {
    header("Location: " . $url);
    exit();
}

function clean($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function formatDate($date) {
    return date('d M Y', strtotime($date));
}
?>
