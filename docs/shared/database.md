# Database System

The `database.php` file provides a centralized database connection management system using PDO. Located in the `shared/` directory, this class ensures consistent and secure database access across the dashboard, API endpoints, cron jobs, and Matomo plugin integration.

## Usage Examples

### Basic Connection Access
```php
require_once("shared/database.php");

// The connection is available as a global PDO instance
global $pdo;
```

### Query Execution
```php
// Simple select with prepared statement
$stmt = $pdo->prepare("SELECT * FROM recordings WHERE id = ?");
$stmt->execute([$recordingId]);
$recording = $stmt->fetch(PDO::FETCH_ASSOC);

// Insert with multiple parameters
$stmt = $pdo->prepare("INSERT INTO events (session_id, type, data) VALUES (?, ?, ?)");
$stmt->execute([$sessionId, $eventType, $eventData]);

// Transaction example
$pdo->beginTransaction();
try {
    // Multiple operations
    $pdo->commit();
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Database error: " . $e->getMessage());
    throw $e;
}
```

## System Usage

The database connection is used across different system components:

### Dashboard
- API endpoints for session management
- Recording data retrieval
- User interaction tracking
- Analytics processing

### API Endpoints
- Recording data storage
- Session management
- Event processing
- Data validation

### Cron Jobs
- Batch processing of recordings
- Data cleanup tasks
- Analytics generation
- System maintenance

### Matomo Plugin
- Table creation and updates
- Data synchronization
- Plugin configuration storage
- Integration management

## Key Features

### 1. Connection Management
- Single connection instance per request
- PDO-based secure database access
- Automatic error handling
- UTF-8 character encoding

### 2. Security Features
- Prepared statements by default
- Exception-based error handling
- Secure credential management
- Connection encryption support

## Performance Considerations

1. **Connection Management**
   - Single connection instance
   - Automatic cleanup
   - Transaction support

2. **Query Execution**
   - Prepared statements
   - Error handling
   - Result set management

Remember: The database system provides a single, secure point of database access for all system components. Always use prepared statements and proper error handling in your database operations.

