# EasySettings System

The EasySettings system provides a unified approach to managing application settings across both server-side (PHP) and client-side (JavaScript) components. It handles persistent storage, retrieval, and real-time updates of configuration values.

## PHP Implementation

The PHP `EasySettings` class provides the backend storage and management of settings.

### Usage Examples

```php
// Access the global settings instance
global $ES;

// Retrieve all settings
$settings = $ES->getSettings();

// Get a specific setting with default fallback
$value = $ES->getSetting('custom_base_url', '');

// Update a setting
$ES->setSetting('capture_keyboard', '1');

// Force refresh settings from database
$freshSettings = $ES->getSettings(true);
```

### Key Features

- **Caching**: Settings are cached in memory and only reloaded when needed
- **Default Values**: Support for default fallbacks when settings are missing
- **Error Logging**: Automatic logging of missing settings
- **Database Integration**: Uses PDO for secure database operations

## JavaScript Implementation

The JavaScript `EasySettings` class manages the dashboard UI for settings configuration.

### Key Features

- **Real-time Updates**: Settings changes are reflected immediately in the UI
- **Value Validation**: Automatic validation and formatting of input values
- **Change Detection**: Tracks modified settings and enables save button only when changes exist
- **UI Integration**: Seamless integration with the dashboard's theme and layout

### Supported Settings

1. **Base URL Configuration**
   - Custom base URL toggle and input
   - Validation and format checking

2. **Recording Options**
   - Keyboard capture toggle
   - External resource recording toggle
   - Recording frequency control (in milliseconds)
   - Recording strategy selection (URL, URL-Query, Code)

3. **Heatmap Configuration**
   - Resolution control (1 hour to 7 days)
   - Precision settings (1 to 16 pixels)
   - Breakpoint presets (Bootstrap, Tailwind, Foundation, Custom)

### Breakpoint Management

The system supports several breakpoint presets:
- **Bootstrap**: 576px, 768px, 992px, 1200px, 1400px
- **Tailwind**: 640px, 768px, 1024px, 1280px, 1536px
- **Foundation**: 641px, 1025px, 1201px, 1441px
- **Custom**: User-defined breakpoints

## Available Settings

> [!WARNING]
> This list may be outdated. Please refer to [EasySetup.php](../matomo_plugin/EasySetup.php) for the most accurate information.	

### Base URL Settings
- `custom_base_url`: Custom base URL for the application
  - Type: string
  - Default: empty string
  - Example: "https://example.com"

### Recording Settings
- `capture_keyboard`: Enable/disable keyboard event capture
  - Type: string ("0" or "1")
  - Default: "0"
  - Example: "1"

- `ignore_class`: CSS class name for elements to ignore during keyboard capture
  - Type: string
  - Default: empty string
  - Example: "no-record"

- `hard_record_external`: Enable/disable recording of external scripts and images
  - Type: string ("0" or "1")
  - Default: "0"
  - Example: "1"

- `mouse_frequency`: Frequency of mouse movement recording in milliseconds
  - Type: string (numeric)
  - Default: "50"
  - Range: 10-1000

- `recording_strategy`: Strategy for triggering recordings
  - Type: string
  - Values: "url", "url-query", "code"
  - Default: "url"

### Heatmap Settings
- `heatmap_resolution`: Time window for heatmap data in hours
  - Type: string (numeric)
  - Values: 1, 2, 3, 6, 12, 24, 48, 72, 96, 120, 144, 168
  - Default: "24"

- `mouse_precision`: Precision of mouse tracking in pixels
  - Type: string (numeric)
  - Values: 1, 2, 4, 8, 16
  - Default: "1"

- `breakpoint_preset`: Preset for responsive breakpoints
  - Type: string
  - Values: "bootstrap", "tailwind", "foundation", "custom"
  - Default: "bootstrap"

## Integration

The PHP and JavaScript components work together to provide a seamless settings management experience:

1. PHP class handles persistent storage in the database
2. JavaScript UI allows real-time configuration
3. Changes are saved via API endpoints
4. Updates are immediately reflected in both backend and frontend

## Best Practices

1. **Setting Access**
   - Always provide default values when getting settings
   - Use type-appropriate comparisons (e.g., `=== '1'` for boolean settings)
   - Handle missing settings gracefully

2. **Updates**
   - Validate values before saving
   - Consider impact on active sessions
   - Use transactions for multiple setting updates

3. **UI Interaction**
   - Provide immediate feedback for changes
   - Validate input before saving
   - Show clear error messages for invalid values

