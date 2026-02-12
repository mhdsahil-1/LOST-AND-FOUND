<?php
require_once 'config.php';
require_once 'includes/functions.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

$filter_type = $_GET['type'] ?? '';
$filter_category = $_GET['category'] ?? '';
$filter_status = 'open';

$items = getItems($filter_status, $filter_type, $filter_category);
$categories = getCategories();

include 'includes/header.php';
?>

<div class="card">
    <h2>🔍 Browse Lost & Found Items</h2>
    
    <form method="GET" class="filters">
        <select name="type" onchange="this.form.submit()">
            <option value="">All Types</option>
            <option value="lost" <?php echo $filter_type === 'lost' ? 'selected' : ''; ?>>Lost Items</option>
            <option value="found" <?php echo $filter_type === 'found' ? 'selected' : ''; ?>>Found Items</option>
        </select>
        
        <select name="category" onchange="this.form.submit()">
            <option value="">All Categories</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?php echo $cat['id']; ?>" <?php echo $filter_category == $cat['id'] ? 'selected' : ''; ?>>
                    <?php echo $cat['icon'] . ' ' . $cat['name']; ?>
                </option>
            <?php endforeach; ?>
        </select>
        
        <button type="submit" class="btn btn-primary">Apply Filters</button>
        <?php if ($filter_type || $filter_category): ?>
            <a href="browse.php" class="btn btn-secondary">Clear Filters</a>
        <?php endif; ?>
    </form>
    
    <?php if (empty($items)): ?>
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>No items found</h3>
            <p>Try adjusting your filters or check back later.</p>
        </div>
    <?php else: ?>
        <p style="color: #636e72; margin-bottom: 20px;">
            Showing <?php echo count($items); ?> item(s)
        </p>
        
        <div class="items-grid">
            <?php foreach ($items as $item): ?>
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
                        <div class="item-details">
                            👤 Posted by: <?php echo clean($item['posted_by']); ?>
                        </div>
                        
                        <div class="item-footer">
                            <span class="badge badge-<?php echo $item['status']; ?>">
                                <?php echo strtoupper($item['status']); ?>
                            </span>
                            <a href="item-details.php?id=<?php echo $item['id']; ?>" class="btn btn-primary" style="padding: 8px 15px; font-size: 14px;">View Details</a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>
