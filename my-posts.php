<?php
/*My Posts Page */
require_once 'config.php';
require_once 'includes/functions.php';

// Check if student is logged in
if (!isLoggedIn()) {
    redirect('login.php');
}

// Get current student's name from session
$student_name = $_SESSION['student_name'];

// Handle delete action
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $item_id = (int)$_GET['delete'];
    
    // Check if item belongs to this student
    $item = getItemById($item_id);
    if ($item && $item['posted_by'] === $student_name) {
        deleteItem($item_id);
        $success = "Item deleted successfully!";
    } else {
        $error = "You can only delete your own items!";
    }
}

// Get all items posted by this student
$all_items = getAllItems();
$my_items = [];

foreach ($all_items as $item) {
    if ($item['posted_by'] === $student_name) {
        $my_items[] = $item;
    }
}

// Sort by newest first
usort($my_items, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
});

$categories = getCategories();

include 'includes/header.php';
?>

<div class="card">
    <h2>📝 My Posts</h2>
    <p style="color: #636e72;">Items you have posted: <strong><?php echo count($my_items); ?></strong></p>
    
    <?php if (isset($success)): ?>
        <div class="alert alert-success"><?php echo $success; ?></div>
    <?php endif; ?>
    
    <?php if (isset($error)): ?>
        <div class="alert alert-error"><?php echo $error; ?></div>
    <?php endif; ?>
    
    <?php if (empty($my_items)): ?>
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>No Posts Yet</h3>
            <p>You haven't posted any items yet.</p>
            <a href="post-item.php" class="btn btn-primary">Post Your First Item</a>
        </div>
    <?php else: ?>
        <div class="items-grid">
            <?php foreach ($my_items as $item): ?>
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
                            🕐 Posted: <?php echo formatDate($item['created_at']); ?>
                        </div>
                        
                        <div class="item-footer">
                            <span class="badge badge-<?php echo $item['status']; ?>">
                                <?php echo strtoupper($item['status']); ?>
                            </span>
                            
                            <?php if ($item['status'] === 'pending'): ?>
                                <span style="color: #f39c12; font-size: 12px;">⏳ Waiting for admin approval</span>
                            <?php elseif ($item['status'] === 'open'): ?>
                                <a href="item-details.php?id=<?php echo $item['id']; ?>" class="btn btn-primary" style="padding: 8px 15px; font-size: 14px;">View Details</a>
                            <?php endif; ?>
                            
                            <?php if ($item['status'] !== 'returned'): ?>
                                <a href="my-posts.php?delete=<?php echo $item['id']; ?>" 
                                   class="btn btn-danger" 
                                   style="padding: 8px 15px; font-size: 14px;"
                                   onclick="return confirm('Are you sure you want to delete this item?')">
                                    🗑️ Delete
                                </a>
                            <?php endif; ?>
                        </div>
                        
                        <?php if ($item['status'] === 'pending'): ?>
                            <div class="alert" style="background: #fff3cd; color: #856404; padding: 10px; margin-top: 10px; border-radius: 5px; font-size: 14px;">
                                ℹ️ Your item is waiting for admin verification. Once approved, it will be visible to other students.
                            </div>
                        <?php elseif ($item['status'] === 'returned'): ?>
                            <div class="alert" style="background: #d4edda; color: #155724; padding: 10px; margin-top: 10px; border-radius: 5px; font-size: 14px;">
                                ✅ This item has been successfully returned!
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>
