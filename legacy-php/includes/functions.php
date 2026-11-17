<?php

function readJSON($filename) {
    $filepath = DATA_DIR . $filename;
    
    if (!file_exists($filepath)) {
        return [];
    }
    
    $content = file_get_contents($filepath);
    $decoded = json_decode($content, true);
    return $decoded ?: [];
}

function writeJSON($filename, $data) {
    $filepath = DATA_DIR . $filename;
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($filepath, $json) !== false;
}

function getCategories() {
    return readJSON('categories.json');
}

function getCategoryName($category_id) {
    $categories = getCategories();
    foreach ($categories as $cat) {
        if ($cat['id'] == $category_id) {
            return $cat['name'];
        }
    }
    return 'Unknown';
}

function getCategoryIcon($category_id) {
    $categories = getCategories();
    foreach ($categories as $cat) {
        if ($cat['id'] == $category_id) {
            return $cat['icon'];
        }
    }
    return '📦';
}

function getAllItems() {
    return readJSON('items.json');
}

function getItemById($item_id) {
    $items = getAllItems();
    foreach ($items as $item) {
        if ($item['id'] == $item_id) {
            return $item;
        }
    }
    return null;
}

function getItems($status = '', $type = '', $category = '') {
    $items = getAllItems();
    $filtered = [];
    foreach ($items as $item) {
        if ($status && $item['status'] !== $status) continue;
        if ($type && $item['item_type'] !== $type) continue;
        if ($category && $item['category_id'] != $category) continue;
        $filtered[] = $item;
    }
    return $filtered;
}

function addItem($itemData) {
    $items = getAllItems();
    $maxId = 0;
    foreach ($items as $item) {
        if ($item['id'] > $maxId) $maxId = $item['id'];
    }
    $newItem = [
        'id' => $maxId + 1,
        'item_type' => $itemData['item_type'],
        'category_id' => $itemData['category_id'],
        'title' => $itemData['title'],
        'description' => $itemData['description'],
        'location' => $itemData['location'],
        'date_lost_found' => $itemData['date_lost_found'],
        'image' => $itemData['image'] ?? '',
        'status' => 'pending',
        'posted_by' => $itemData['posted_by'],
        'contact' => $itemData['contact'],
        'created_at' => date('Y-m-d H:i:s')
    ];
    $items[] = $newItem;
    return writeJSON('items.json', $items);
}

function updateItemStatus($item_id, $status) {
    $items = getAllItems();
    foreach ($items as $key => $item) {
        if ($item['id'] == $item_id) {
            $items[$key]['status'] = $status;
            return writeJSON('items.json', $items);
        }
    }
    return false;
}

function deleteItem($item_id) {
    $items = getAllItems();
    $filtered = [];
    foreach ($items as $item) {
        if ($item['id'] != $item_id) {
            $filtered[] = $item;
        }
    }
    return writeJSON('items.json', $filtered);
}

function getStatistics() {
    $items = getAllItems();
    $stats = [
        'total' => count($items),
        'pending' => 0,
        'open' => 0,
        'returned' => 0,
        'lost' => 0,
        'found' => 0
    ];
    foreach ($items as $item) {
        if ($item['status'] === 'pending') $stats['pending']++;
        if ($item['status'] === 'open') $stats['open']++;
        if ($item['status'] === 'returned') $stats['returned']++;
        if ($item['item_type'] === 'lost') $stats['lost']++;
        if ($item['item_type'] === 'found') $stats['found']++;
    }
    return $stats;
}

function uploadImage($file) {
    if (!isset($file) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        return '';
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    if ($file['size'] > MAX_FILE_SIZE) {
        return false;
    }
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, ALLOWED_EXTENSIONS)) {
        return false;
    }
    $filename = uniqid('item_') . '.' . $extension;
    $destination = UPLOAD_DIR . $filename;
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        return $filename;
    }
    return false;
}

?>
