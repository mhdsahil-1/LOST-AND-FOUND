<?php
require_once 'config.php';
require_once 'includes/functions.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

$stats = getStatistics();
$recent_items = array_slice(getItems('open'), 0, 6);

include 'includes/header.php';
?>

<div class="welcome-card">
    <h1>👋 Welcome, <?php echo clean($_SESSION['student_name']); ?>!</h1>
    <p>Find lost items and help reunite found items with their owners.</p>
</div>

<div class="stats-grid">
    <div class="stat-card stat-primary">
        <div class="stat-icon">📊</div>
        <div class="stat-number"><?php echo $stats['total']; ?></div>
        <div class="stat-label">Total Items</div>
    </div>
    
    <div class="stat-card stat-success">
        <div class="stat-icon">🔓</div>
        <div class="stat-number"><?php echo $stats['open']; ?></div>
        <div class="stat-label">Open Items</div>
    </div>
    
    <div class="stat-card stat-danger">
        <div class="stat-icon">❌</div>
        <div class="stat-number"><?php echo $stats['lost']; ?></div>
        <div class="stat-label">Lost Items</div>
    </div>
    
    <div class="stat-card stat-warning">
        <div class="stat-icon">✅</div>
        <div class="stat-number"><?php echo $stats['found']; ?></div>
        <div class="stat-label">Found Items</div>
    </div>
</div>

<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2> Recent Items</h2>
        <a href="browse.php" class="btn btn-primary">View All</a>
    </div>
    
    <?php if (empty($recent_items)): ?>
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>No Items Yet</h3>
            <p>Be the first to post an item!</p>
            <a href="post-item.php" class="btn btn-primary">Post Item</a>
        </div>
    <?php else: ?>
        <div class="items-grid">
            <?php foreach ($recent_items as $item): ?>
                <div class="item-card">
                    <?php if ($item['image']): ?>
                        <img src="<?php echo UPLOAD_URL . $item['image']; ?>" alt="Item image" class="item-image">
                    <?php else: ?>
                        <div class="item-image" style="display: flex; align-items: center; justify-content: center; font-size: 48px;">
                            <?php echo getCategoryIcon($item['category_id']); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="item-content">
                        <div class="item-header">
                            <div class="item-title"><?php echo clean($item['title']); ?></div>
                            <div class="item-category"><?php echo getCategoryIcon($item['category_id']); ?></div>
                        </div>
                        
                        <span class="item-type item-type-<?php echo $item['item_type']; ?>">
                            <?php echo strtoupper($item['item_type']); ?>
                        </span>
                        
                        <p class="item-description"><?php echo clean($item['description']); ?></p>
                        
                        <div class="item-details">
                            📍 <?php echo clean($item['location']); ?>
                        </div>
                        <div class="item-details">
                            📅 <?php echo formatDate($item['date_lost_found']); ?>
                        </div>
                        
                        <div class="item-footer">
                            <a href="item-details.php?id=<?php echo $item['id']; ?>" class="btn btn-primary" style="padding: 8px 15px; font-size: 14px;">View Details</a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<div class="quick-actions">
    <h2>🚀 Quick Actions</h2>
    <div class="action-grid">
        <a href="post-item.php" class="action-card">
            <div class="action-icon">+</div>
            <h3>Post an Item</h3>
            <p>Report a lost or found item</p>
        </a>
        
        <a href="browse.php" class="action-card">
            <div class="action-icon">🔍</div>
            <h3>Browse Items</h3>
            <p>Search for your lost items</p>
        </a>
        
        <a href="my-posts.php" class="action-card">
            <div class="action-icon">📝</div>
            <h3>My Posts</h3>
            <p>View your posted items</p>
        </a>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
