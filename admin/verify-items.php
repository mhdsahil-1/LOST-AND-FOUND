<?php

require_once '../config.php';
require_once '../includes/functions.php';

if (!isAdmin()) {
    redirect('login.php');
}

$success = '';
$error = '';

if (isset($_GET['action']) && isset($_GET['id'])) {
    $action = $_GET['action'];
    $item_id = (int)$_GET['id'];
    
    if ($action === 'approve') {
        if (updateItemStatus($item_id, 'open')) {
            $success = '✅ Item approved successfully!';
        } else {
            $error = 'Failed to approve item.';
        }
    } 
    elseif ($action === 'reject') {
        if (deleteItem($item_id)) {
            $success = '🗑️ Item rejected and deleted.';
        } else {
            $error = 'Failed to reject item.';
        }
    }
}

$pending_items = getItems('pending');

include '../includes/header.php';
?>

<div class="card">
    <h2>✅ Verify Pending Items</h2>
    <p style="color: #636e72;">
        Review and approve student submissions
    </p>
    
    <?php if ($success): ?>
        <div class="alert alert-success"><?php echo $success; ?></div>
    <?php endif; ?>
    
    <?php if ($error): ?>
        <div class="alert alert-error">⚠️ <?php echo $error; ?></div>
    <?php endif; ?>
    
    <?php if (empty($pending_items)): ?>
        <div class="empty-state">
            <div class="empty-state-icon">✨</div>
            <h3>All Caught Up!</h3>
            <p>No pending items to verify.</p>
            <a href="dashboard.php" class="btn btn-primary">Back to Dashboard</a>
        </div>
        
    <?php else: ?>
        <p style="margin-bottom: 20px;">
            <strong><?php echo count($pending_items); ?></strong> item(s) waiting for approval
        </p>
        
        <div class="items-grid">
            <?php foreach ($pending_items as $item): ?>
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
                        <div class="item-details">
                            📞 Contact: <?php echo clean($item['contact']); ?>
                        </div>
                        
                        <div class="item-footer" style="display: flex; gap: 10px; margin-top: 15px;">
                            <a href="verify-items.php?action=approve&id=<?php echo $item['id']; ?>" 
                               class="btn btn-success" 
                               style="flex: 1; text-align: center;"
                               onclick="return confirm('Approve this item?')">
                                ✅ Approve
                            </a>
                            <a href="verify-items.php?action=reject&id=<?php echo $item['id']; ?>" 
                               class="btn btn-danger" 
                               style="flex: 1; text-align: center;"
                               onclick="return confirm('Reject and delete this item?')">
                                ❌ Reject
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php include '../includes/footer.php'; ?>
