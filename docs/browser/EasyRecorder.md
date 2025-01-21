# Browser Scripts - [EasyRecorder.js](/scripts/EasyRecorder.js) - EasyRecorder class

The `EasyRecorder` class provides a sophisticated system for recording user interactions, DOM mutations, and page state in web applications. It captures a comprehensive set of browser events and manages their efficient storage and transmission.

## Core Features

### 1. Session Management
- Unique session ID generation and tracking
- Cookie-based session persistence
- Custom recording code support
- Configurable recording strategies

### 2. Event Capture
Captures multiple types of user interactions:
- Mouse movements ([`EasyMouseMoveEvent`](./EasyEvents/EasyMouseMoveEvent.md))
- Mouse clicks ([`EasyMouseClickEvent`](./EasyEvents/EasyMouseClickEvent.md))
- Keyboard input ([`EasyKeyboardEvent`](./EasyEvents/EasyKeyboardEvent.md))
- Page scrolling ([`EasyScrollEvent`](./EasyEvents/EasyScrollEvent.md))
- DOM mutations ([`EasyMutationEvent`](./EasyEvents/EasyMutationEvent.md))

### 3. State Preservation
Captures and maintains:
- Page styles (CSS)
- Scripts
- DOM structure
- Element relationships
- Attribute states

## Constructor

```javascript
constructor()
```

Initializes a new recording session with:
- Timestamp tracking
- Event collection
- Session management
- Element ID mapping
- Event listeners registration

## Core Methods

### static async start(code?)
```javascript
static async start(code: string | null = null): Promise<void>
```
Starts a new recording session.

#### Parameters
- `code` (optional): Custom recording identifier

### async data()
```javascript
async data(): Promise<string>
```
Retrieves compressed recording data.

#### Returns
- Compressed JSON string of recorded events

### async retrieveCore()
```javascript
async retrieveCore(): Promise<Object>
```
Collects core page data including styles, scripts, and DOM structure.

#### Returns
- Object containing:
  - `st`: Compressed stylesheet data
  - `sc`: Compressed script data
  - `el`: Compressed DOM elements

## Event Handling Methods

### mouseMoveEvent(event)
```javascript
mouseMoveEvent(event: MouseEvent): void
```
Captures mouse movement coordinates.

### mouseClickEvent(event)
```javascript
mouseClickEvent(event: MouseEvent): void
```
Records mouse clicks with:
- Button state (down/up)
- Button type (left/middle/right)
- Coordinates
- Target element

### keyboardEvent(event)
```javascript
keyboardEvent(event: KeyboardEvent): void
```
Tracks keyboard interactions:
- Key pressed
- Key state (down/up)
- Modifier keys
- Focused element

### scrollEvent(event)
```javascript
scrollEvent(event: Event): void
```
Records scroll positions:
- Horizontal position
- Vertical position

## Data Collection Methods

### async styles()
```javascript
async styles(): Promise<string>
```
Collects and compresses all stylesheet data.

### async scripts()
```javascript
async scripts(): Promise<string>
```
Collects and compresses script content, excluding tracking scripts.

### async bodyElements()
```javascript
async bodyElements(): Promise<string>
```
Captures and processes DOM structure:
- Element hierarchy
- Attributes
- Content
- Unique IDs

## Utility Methods

### getUniqueID(element)
```javascript
getUniqueID(element: Element): number
```
Manages unique element identification.

### convertRelativeURLs(element)
```javascript
convertRelativeURLs(element: Element): void
```
Converts relative URLs to absolute for:
- Images
- Links
- Scripts
- Inline styles

## Data Transmission

### async sendChunk()
```javascript
async sendChunk(): Promise<void>
```
Manages periodic data transmission:
- Compresses current chunk
- Includes metadata
- Handles transmission errors
- Manages recording state

## Configuration Options

### Recording Strategies
- `url`: Uses pathname as recording code
- `url-query`: Uses pathname + query string
- Custom: Uses provided code

### Chunk Management
- Configurable chunk timing
- Automatic transmission
- Error handling
- State preservation

## Example Usage

```javascript
// Start recording with default settings
await EasyRecorder.start();

// Start recording with custom code
await EasyRecorder.start('custom-recording-123');

// Access recording data manually
const recorder = new EasyRecorder();
const compressedData = await recorder.data();

// Configure custom chunk timing
EHM.ct = 30; // 30-second chunks
```

## Integration Notes

### 1. Setup Requirements
- Include required Event classes
- Include Compression utilities
- Configure API endpoint

### 2. Performance Considerations
- Event throttling
- Chunk size optimization
- Memory management
- Network efficiency

### 3. Browser Support
Requires support for:
- MutationObserver
- Compression Streams
- Modern DOM APIs
- Cookie handling

### 4. Security Considerations
- Session management
- Data sanitization
- URL handling
- Script filtering

## Best Practices

1. **Memory Management**
   - Regular chunk transmission
   - Efficient event filtering
   - Proper cleanup

2. **Error Handling**
   ```javascript
   try {
       await EasyRecorder.start();
   } catch (error) {
       console.error('Recording failed:', error);
   }
   ```

3. **Network Optimization**
   ```javascript
   // Adjust chunk timing based on data volume
   if (dataVolume > threshold) {
       EHM.ct = 15; // Shorter chunks for high volume
   }
   ```

4. **State Management**
   ```javascript
   // Check recording state
   if (!EHM.r.paused) {
       await EHM.r.sendChunk();
   }
   ```

