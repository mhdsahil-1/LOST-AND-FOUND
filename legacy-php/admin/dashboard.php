<?php
require_once '../config.php';
require_once '../includes/functions.php';

if (!isAdmin()) {
    redirect('login.php');
}

$stats = getStatistics();
$all_items = getAllItems();
usort($all_items, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
});
$recent_items = array_slice($all_items, 0, 10);

include '../includes/header.php';
?>

<div class="welcome-card">
    <h1>Admin Dashboard</h1>
    <p>Manage and verify lost & found items</p>
</div>

<div class="stats-grid">
    <div class="stat-card stat-primary">
        <div class="stat-icon">📊</div>
        <div class="stat-number"><?php echo $stats['total']; ?></div>
        <div class="stat-label">Total Items</div>
    </div>
    
    <div class="stat-card stat-warning">
        <div class="stat-icon">⏳</div>
        <div class="stat-number"><?php echo $stats['pending']; ?></div>
        <div class="stat-label">Pending Approval</div>
    </div>
    
    <div class="stat-card stat-success">
        <div class="stat-icon">🔓</div>
        <div class="stat-number"><?php echo $stats['open']; ?></div>
        <div class="stat-label">Open Items</div>
    </div>
    
    <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-number"><?php echo $stats['returned']; ?></div>
        <div class="stat-label">Returned Items</div>
    </div>
</div>

<div class="card">
    <h2>🚀 Quick Actions</h2>
    <div class="action-grid">
        <a href="verify-items.php" class="action-card">
            <div class="action-icon">✅</div>
            <h3>Verify Items</h3>
            <p>Approve or reject pending items</p>
            <?php if ($stats['pending'] > 0): ?>
                <span class="badge badge-warning"><?php echo $stats['pending']; ?> pending</span>
            <?php endif; ?>
        </a>
        
        <a href="manage-items.php" class="action-card">
            <div class="action-icon">⚙️</div>
            <h3>Manage Items</h3>
            <p>View and modify all items</p>
        </a>
    </div>
</div>

<div class="card">
    <h2>📋 Recent Items</h2>
    
    <?php if (empty($recent_items)): ?>
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>No Items Yet</h3>
            <p>No items have been posted.</p>
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Posted By</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recent_items as $item): ?>
                        <tr>
                            <td><?php echo $item['id']; ?></td>
                            <td>
                                <span class="item-type item-type-<?php echo $item['item_type']; ?>">
                                    <?php echo strtoupper($item['item_type']); ?>
                                </span>
                            </td>
                            <td><?php echo clean($item['title']); ?></td>
                            <td>
                                <?php echo getCategoryIcon($item['category_id']); ?>
                                <?php echo getCategoryName($item['category_id']); ?>
                            </td>
                            <td><?php echo clean($item['posted_by']); ?></td>
                            <td>
                                <span class="badge badge-<?php echo $item['status']; ?>">
                                    <?php echo strtoupper($item['status']); ?>
                                </span>
                            </td>
                            <td><?php echo formatDate($item['created_at']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<?php include '../includes/footer.php'; ?>
