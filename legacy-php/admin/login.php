<?php
require_once '../config.php';

if (isAdmin()) {
    redirect('dashboard.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    
    if (empty($username) || empty($password)) {
        $error = 'Please enter both username and password';
    } 
    elseif ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        redirect('dashboard.php');
    } else {
        $error = 'Invalid username or password!';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="<?php echo SITE_URL; ?>assets/css/style.css">
</head>
<body>
    <div class="container">
        <div class="login-container">
            <div class="login-card">
                <div class="login-icon"><img src="<?php echo SITE_URL; ?>assets/img/admin.png" alt="Admin Icon"> </div>
                
                <h1>Admin Panel</h1>
                <p style="color: #a8a8a8; margin-bottom: 30px;">
                    Login to manage Lost & Found items
                </p>
                
                <?php if ($error): ?>
                    <div class="alert alert-error">
                        ⚠️ <?php echo $error; ?>
                    </div>
                <?php endif; ?>
                
                <form method="POST" action="">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            placeholder="Enter admin username"
                            required
                            autofocus
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Enter password"
                            required
                        >
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                         Login as Admin
                    </button>
                </form>
                
                <div style="margin-top: 20px; text-align: center;">
                    <p style="color: #a8a8a8; font-size: 14px;">
                        <a href="<?php echo SITE_URL; ?>" style="color: #0095f6; text-decoration: none;">
                            ← Back to Student Portal
                        </a>
                    </p>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #121212; border: 1px solid #262626; border-radius: 8px; font-size: 12px; color: #a8a8a8;">
                    <strong style="color: #ffffff;">Default Credentials:</strong><br>
                    Username: <code style="background: #262626; color: #0095f6; padding: 2px 6px; border-radius: 3px;">admin</code><br>
                    Password: <code style="background: #262626; color: #0095f6; padding: 2px 6px; border-radius: 3px;">admin123</code>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
