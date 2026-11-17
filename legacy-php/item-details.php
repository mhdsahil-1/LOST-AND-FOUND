<?php
require_once 'config.php';
require_once 'includes/functions.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

$item_id = $_GET['id'] ?? 0;
$item = getItemById($item_id);

if (!$item) {
    $error = 'Item not found!';
}

include 'includes/header.php';
?>

<?php if (isset($error)): ?>
    <div class="card">
        <div class="empty-state">
            <div class="empty-state-icon">❌</div>
            <h3><?php echo $error; ?></h3>
            <p>The item you're looking for doesn't exist.</p>
            <a href="browse.php" class="btn btn-primary">Browse Items</a>
        </div>
    </div>
    
<?php else: ?>
    <div class="card">
        <div class="item-details-header">
            <h2><?php echo clean($item['title']); ?></h2>
            <span class="badge badge-<?php echo $item['status']; ?>">
                <?php echo strtoupper($item['status']); ?>
            </span>
        </div>
        
        <div class="item-details-container">
            <div class="item-details-image">
                <?php if ($item['image']): ?>
                    <img src="<?php echo UPLOAD_URL . $item['image']; ?>" alt="Item image">
                <?php else: ?>
                    <div class="item-placeholder">
                        <div style="font-size: 100px;">
                            <?php echo getCategoryIcon($item['category_id']); ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="item-details-info">
                <div style="margin-bottom: 20px;">
                    <span class="item-type item-type-<?php echo $item['item_type']; ?>" 
                          style="padding: 10px 20px; font-size: 16px;">
                        <?php echo strtoupper($item['item_type']); ?>
                    </span>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">📂 Category</div>
                    <div class="detail-value">
                        <?php echo getCategoryIcon($item['category_id']); ?>
                        <?php echo getCategoryName($item['category_id']); ?>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">📝 Description</div>
                    <div class="detail-value">
                        <?php echo nl2br(clean($item['description'])); ?>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">📍 Location</div>
                    <div class="detail-value">
                        <?php echo clean($item['location']); ?>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">📅 Date</div>
                    <div class="detail-value">
                        <?php echo formatDate($item['date_lost_found']); ?>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">👤 Posted By</div>
                    <div class="detail-value">
                        <?php echo clean($item['posted_by']); ?>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">📞 Contact</div>
                    <div class="detail-value">
                        <a href="mailto:<?php echo clean($item['contact']); ?>" 
                           style="color: #667eea; text-decoration: none;">
                            <?php echo clean($item['contact']); ?>
                        </a>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">🕐 Posted On</div>
                    <div class="detail-value">
                        <?php echo formatDate($item['created_at']); ?>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <a href="mailto:<?php echo clean($item['contact']); ?>" 
                       class="btn btn-primary btn-block">
                        📧 Contact Owner
                    </a>
                    <a href="browse.php" class="btn btn-secondary btn-block" 
                       style="margin-top: 10px;">
                        ← Back to Browse
                    </a>
                </div>
                
            </div>
        </div>
    </div>
<?php endif; ?>

<?php include 'includes/footer.php'; ?>
