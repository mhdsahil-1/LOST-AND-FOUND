<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="<?php echo SITE_URL; ?>assets/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="<?php echo SITE_URL; ?>">🔍 <?php echo SITE_NAME; ?></a>
            </div>
            
            <div class="nav-links">
                <?php if (isLoggedIn()): ?>
                    <a href="<?php echo SITE_URL; ?>index.php">🏠 Home</a>
                    <a href="<?php echo SITE_URL; ?>browse.php">🔍 Browse</a>
                    <a href="<?php echo SITE_URL; ?>post-item.php">+ Post Item</a>
                    <a href="<?php echo SITE_URL; ?>my-posts.php">📝 My Posts</a>
                    <div class="nav-user">
                        <span>👤 <?php echo clean($_SESSION['student_name']); ?></span>
                        <a href="<?php echo SITE_URL; ?>logout.php" class="btn btn-secondary btn-sm">Logout</a>
                    </div>
                <?php elseif (isAdmin()): ?>
                    <a href="<?php echo SITE_URL; ?>admin/dashboard.php">📊 Dashboard</a>
                    <a href="<?php echo SITE_URL; ?>admin/verify-items.php">✅ Verify Items</a>
                    <a href="<?php echo SITE_URL; ?>admin/manage-items.php">⚙️ Manage</a>
                    <div class="nav-user">
                        <span>Admin</span>
                        <a href="<?php echo SITE_URL; ?>admin/logout.php" class="btn btn-secondary btn-sm">Logout</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </nav>
    
    <div class="container">
