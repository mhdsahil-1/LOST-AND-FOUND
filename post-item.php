<?php
require_once 'config.php';
require_once 'includes/functions.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

$categories = getCategories();
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $item_type = $_POST['item_type'] ?? '';
    $category_id = $_POST['category_id'] ?? '';   
    $title = trim($_POST['title'] ?? '');          
    $description = trim($_POST['description'] ?? '');
    $location = trim($_POST['location'] ?? '');  
    $date = $_POST['date_lost_found'] ?? '';
    $contact = trim($_POST['contact'] ?? '');     
    
    if (empty($item_type) || empty($category_id) || empty($title) || 
        empty($description) || empty($location) || empty($date) || empty($contact)) {
        $error = 'Please fill in all required fields!';
    } else {
        $image_filename = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $image_filename = uploadImage($_FILES['image']);
            if ($image_filename === false) {
                $error = 'Image upload failed! Make sure it is JPG/PNG and under 5MB.';
            }
        }
        
        if (empty($error)) {
            $itemData = [
                'item_type' => $item_type,
                'category_id' => $category_id,
                'title' => $title,
                'description' => $description,
                'location' => $location,
                'date_lost_found' => $date,
                'image' => $image_filename,
                'posted_by' => $_SESSION['student_name'], 
                'contact' => $contact
            ];
            if (addItem($itemData)) {
                $success = '✅ Item posted successfully! It will be visible after admin approval.';
            } else {
                $error = 'Failed to save item. Please try again.';
            }
        }
    }
}

include 'includes/header.php';
?>

<div class="card">
    <h2>+Post an Item</h2>
    <p style="color: #636e72;">Report a lost or found item to help reunite it with its owner</p>
    
    <?php if ($success): ?>
        <div class="alert alert-success">
            <?php echo $success; ?>
        </div>
    <?php endif; ?>
    
    <?php if ($error): ?>
        <div class="alert alert-error">
            ⚠️ <?php echo $error; ?>
        </div>
    <?php endif; ?>
    
    <form method="POST" enctype="multipart/form-data" class="post-form">
        <div class="form-group">
            <label>Item Type <span style="color: red;">*</span></label>
            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" name="item_type" value="lost" required>
                    <span>❌ Lost - I lost this item</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="item_type" value="found" required>
                    <span>✅ Found - I found this item</span>
                </label>
            </div>
        </div>
        
        <!-- Category Dropdown -->
        <div class="form-group">
            <label for="category_id">Category <span style="color: red;">*</span></label>
            <select name="category_id" id="category_id" required>
                <option value="">Select a category</option>
                <?php foreach ($categories as $cat): ?>
                    <option value="<?php echo $cat['id']; ?>">
                        <?php echo $cat['icon'] . ' ' . $cat['name']; ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        
        <!-- Item Title -->
        <div class="form-group">
            <label for="title">Item Title <span style="color: red;">*</span></label>
            <input 
                type="text" 
                id="title" 
                name="title" 
                placeholder="e.g., Black iPhone 13 PRO"
                required
            >
            <small>Give a short, clear description of the item</small>
        </div>
        
        <!-- Description -->
        <div class="form-group">
            <label for="description">Detailed Description <span style="color: red;">*</span></label>
            <textarea 
                id="description" 
                name="description" 
                rows="4"
                placeholder="Provide more details like color, brand, condition, identifying marks, etc."
                required
            ></textarea>
            <small>The more details, the easier to identify!</small>
        </div>
        
        <!-- Location -->
        <div class="form-group">
            <label for="location">Location <span style="color: red;">*</span></label>
            <input 
                type="text" 
                id="location" 
                name="location" 
                placeholder="e.g., Library 2nd Floor, Main Canteen"
                required
            >
            <small>Where was the item lost or found?</small>
        </div>
        
        <!-- Date -->
        <div class="form-group">
            <label for="date_lost_found">Date <span style="color: red;">*</span></label>
            <input 
                type="date" 
                id="date_lost_found" 
                name="date_lost_found" 
                max="<?php echo date('Y-m-d'); ?>"
                required
            >
            <small>When did you lose/find this item?</small>
        </div>
        
        <!-- Contact Information -->
        <div class="form-group">
            <label for="contact">Contact (Email or Phone) <span style="color: red;">*</span></label>
            <input 
                type="text" 
                id="contact" 
                name="contact" 
                placeholder="email@example.com or 9876543210"
                required
            >
            <small>How should people contact you?</small>
        </div>
        
        <!-- Image Upload (Optional) -->
        <div class="form-group">
            <label for="image">Upload Image (Optional)</label>
            <input 
                type="file" 
                id="image" 
                name="image" 
                accept="image/jpeg,image/jpg,image/png,image/gif"
            >
            <small>JPG, PNG, or GIF. Maximum 5MB</small>
        </div>
        
        <!-- Submit Button -->
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">
                📤 Submit Item
            </button>
            <a href="index.php" class="btn btn-secondary">
                Cancel
            </a>
        </div>
        
    </form>
</div>

<?php include 'includes/footer.php'; ?>
