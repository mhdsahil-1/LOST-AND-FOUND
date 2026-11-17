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
    
    if ($action === 'delete') {
        if (deleteItem($item_id)) {
            $success = '🗑️ Item deleted successfully!';
        } else {
            $error = 'Failed to delete item.';
        }
    } 
    elseif ($action === 'set_open') {
        if (updateItemStatus($item_id, 'open')) {
            $success = '✅ Item status changed to Open!';
        } else {
            $error = 'Failed to update status.';
        }
    } 
    elseif ($action === 'set_returned') {
        if (updateItemStatus($item_id, 'returned')) {
            $success = '✅ Item marked as Returned!';
        } else {
            $error = 'Failed to update status.';
        }
    }
}

$filter_status = $_GET['status'] ?? '';
$filter_type = $_GET['type'] ?? '';
$items = getItems($filter_status, $filter_type);

include '../includes/header.php';
?>

<div class="card">
    <h2>⚙️ Manage All Items</h2>
    <p style="color: #636e72;">View and modify all items in the system</p>
    
    <?php if ($success): ?>
        <div class="alert alert-success"><?php echo $success; ?></div>
    <?php endif; ?>
    
    <?php if ($error): ?>
        <div class="alert alert-error">⚠️ <?php echo $error; ?></div>
    <?php endif; ?>
    
    <form method="GET" class="filters">
        <select name="status" onchange="this.form.submit()">
            <option value="">All Statuses</option>
            <option value="pending" <?php echo $filter_status === 'pending' ? 'selected' : ''; ?>>Pending</option>
            <option value="open" <?php echo $filter_status === 'open' ? 'selected' : ''; ?>>Open</option>
            <option value="returned" <?php echo $filter_status === 'returned' ? 'selected' : ''; ?>>Returned</option>
        </select>
        
        <select name="type" onchange="this.form.submit()">
            <option value="">All Types</option>
            <option value="lost" <?php echo $filter_type === 'lost' ? 'selected' : ''; ?>>Lost Items</option>
            <option value="found" <?php echo $filter_type === 'found' ? 'selected' : ''; ?>>Found Items</option>
        </select>
        
        <button type="submit" class="btn btn-primary">Apply Filters</button>
        <?php if ($filter_status || $filter_type): ?>
            <a href="manage-items.php" class="btn btn-secondary">Clear Filters</a>
        <?php endif; ?>
    </form>
    
    <?php if (empty($items)): ?>
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>No Items Found</h3>
            <p>No items match your filters.</p>
        </div>
        
    <?php else: ?>
        <p style="margin-bottom: 20px;">
            Showing <strong><?php echo count($items); ?></strong> item(s)
        </p>
        
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($items as $item): ?>
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
                            <td>
                                <div style="display: flex; gap: 5px;">
                                    <?php if ($item['status'] !== 'open'): ?>
                                        <a href="manage-items.php?action=set_open&id=<?php echo $item['id']; ?>" 
                                           class="btn btn-success btn-sm"
                                           onclick="return confirm('Set item to Open?')"
                                           title="Set to Open">
                                            🔓
                                        </a>
                                    <?php endif; ?>
                                    
                                    <?php if ($item['status'] !== 'returned'): ?>
                                        <a href="manage-items.php?action=set_returned&id=<?php echo $item['id']; ?>" 
                                           class="btn btn-secondary btn-sm"
                                           onclick="return confirm('Mark as Returned?')"
                                           title="Mark as Returned">
                                            ✅
                                        </a>
                                    <?php endif; ?>
                                    
                                    <a href="manage-items.php?action=delete&id=<?php echo $item['id']; ?>" 
                                       class="btn btn-danger btn-sm"
                                       onclick="return confirm('Delete this item permanently?')"
                                       title="Delete">
                                        🗑️
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<?php include '../includes/footer.php'; ?>
