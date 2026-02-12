<?php
require_once 'config.php';

if (isLoggedIn()) {
    redirect('index.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    if (empty($name)) {
        $error = 'Please enter your name to continue';
    } else {
        $_SESSION['student_name'] = $name;
        redirect('index.php');
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Login - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="<?php echo SITE_URL; ?>assets/css/style.css">
</head>
<body>
    <div class="container">
        <div class="login-container">
            <div class="login-card">
                <div class="login-icon">👤</div>
                
                <h1>Lost & Found Campus Network</h1>
                <p style="color: #a8a8a8; margin-bottom: 30px;">
                    Welcome! Enter your name to get started
                </p>
                
                <?php if ($error): ?>
                    <div class="alert alert-error">
                        ⚠️ <?php echo $error; ?>
                    </div>
                <?php endif; ?>
                
                <form method="POST" action="">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="Enter your full name"
                            required
                            autofocus
                        >
                        <small>No password needed - just enter your name</small>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                         Login
                    </button>
                </form>
                
                <div style="margin-top: 20px; text-align: center;">
                    <p style="color: #a8a8a8; font-size: 14px;">
                        Are you an administrator? 
                        <a href="admin/login.php" style="color: #0095f6; text-decoration: none;">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
