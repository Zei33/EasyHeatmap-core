# Browser Scripts - EasyReplayer.js - EasyReplayer class

The `EasyReplayer` class provides a sophisticated system for replaying recorded user sessions, including mouse movements, keyboard inputs, DOM mutations, and page state changes. It works in conjunction with `EasyStyles`, `EasyCursor`, and `EasyKeyboard` to provide a complete replay experience.

## Core Components

### Main Classes
- `EasyReplayer`: Main replay orchestration
- [`EasyStyles`](./EasyStyles.md): Style management
- [`EasyCursor`](./EasyCursor.md): Visual cursor simulation
- [`EasyKeyboard`](./EasyKeyboard.md): Keyboard event simulation

## Constructor

```javascript
constructor()
```

Initializes a new replay instance with:
- Timing management
- Event queue
- DOM element mapping
- Visual components

### Properties
- `startTime`: Replay start timestamp
- `replayTime`: Current replay position
- `recording`: Array of parsed events
- `currentEvent`: Index of current event
- `cursor`: Visual cursor instance
- `styles`: Style manager instance
- `idMap`: Element ID to DOM node mapping

## Core Methods

### async load(options, start = false)
```javascript
async load(options: {
    recording?: string,
    styles?: string,
    elements?: string,
    scripts?: string
}, start: boolean = false): Promise<void>
```

Loads and prepares replay data.

#### Parameters
- `options`: Configuration object
  - `recording`: Compressed event data
  - `styles`: Compressed CSS data
  - `elements`: Compressed DOM data
  - `scripts`: Compressed script data
- `start`: Whether to start replay immediately

### start()
```javascript
start(): void
```

Begins the replay sequence.

## Data Loading Methods

### async loadRecording(data)
```javascript
async loadRecording(data: string): Promise<EasyReplayer>
```
Loads compressed event data.

```javascript
// Example: Load recording data
const compressedEvents = "H4sIAAAAAAAA..."; // Base64 compressed data
await replayer.loadRecording(compressedEvents);

// Chain with other operations
await replayer
    .loadRecording(eventData)
    .then(() => console.log('Recording loaded'));
```

### async loadStyles(data)
```javascript
async loadStyles(data: string): Promise<EasyReplayer>
```
Loads and applies stylesheet data.

```javascript
// Example: Load and apply styles
const compressedStyles = "H4sIAAAAAAAA..."; // Base64 compressed CSS
await replayer.loadStyles(compressedStyles);

// Load multiple style sets
const styles = {
    theme: "H4sIAAAA...",
    custom: "H4sIAAAA..."
};
await Promise.all([
    replayer.loadStyles(styles.theme),
    replayer.loadStyles(styles.custom)
]);
```

### async loadScripts(data)
```javascript
async loadScripts(data: string): Promise<EasyReplayer>
```
Loads and executes JavaScript code.

```javascript
// Example: Load and execute scripts
const compressedScripts = "H4sIAAAA..."; // Base64 compressed scripts
await replayer.loadScripts(compressedScripts);

// Handle script loading errors
try {
    await replayer.loadScripts(scriptData);
} catch (error) {
    console.error('Script loading failed:', error);
    // Implement fallback behavior
}
```

### async loadElements(data)
```javascript
async loadElements(data: string): Promise<EasyReplayer>
```
Loads and reconstructs DOM elements.

```javascript
// Example: Load DOM elements
const compressedDOM = "H4sIAAAA..."; // Base64 compressed DOM
await replayer.loadElements(compressedDOM);

// Load with error handling and validation
try {
    await replayer.loadElements(domData);
    const expectedElement = document.querySelector('#target');
    if (!expectedElement) {
        throw new Error('Critical element missing');
    }
} catch (error) {
    console.error('DOM loading failed:', error);
}
```

## Event Replay Methods

### replayEvent(event)
```javascript
replayEvent(event: EasyEvent): void
```
Dispatches events to appropriate handlers.

```javascript
// Example: Manually replay specific events
const mouseEvent = new EasyMouseMoveEvent(Date.now(), 100, 200);
replayer.replayEvent(mouseEvent);

// Replay multiple events in sequence
const events = [
    new EasyMouseMoveEvent(0, 100, 200),
    new EasyMouseClickEvent(100, 100, 200, 0, 0),
    new EasyKeyboardEvent(200, 'a', 0, [false, false, false, false])
];
events.forEach(event => replayer.replayEvent(event));
```

### triggerNextEvent(event)
```javascript
triggerNextEvent(event: EasyEvent): void
```
Schedules next event based on timing.

```javascript
// Example: Manual event scheduling
const event = replayer.recording[replayer.currentEvent];
replayer.triggerNextEvent(event);

// Custom event scheduling
const customEvent = new EasyMouseMoveEvent(500, 300, 400);
setTimeout(() => {
    replayer.triggerNextEvent(customEvent);
}, customEvent.time - replayer.replayTime);
```

## Event Type Handlers

### replayMouseMoveEvent(event)
```javascript
replayMouseMoveEvent(event: EasyMouseMoveEvent): void
```
Simulates mouse movement.

```javascript
// Example: Replay mouse movement
const moveEvent = new EasyMouseMoveEvent(
    Date.now(),
    100,  // x coordinate
    200   // y coordinate
);
replayer.replayMouseMoveEvent(moveEvent);

// Replay with selection
const moveWithSelection = new EasyMouseMoveEvent(
    Date.now(),
    150,
    250,
    document.querySelector('input'),
    { start: 0, end: 5 }
);
replayer.replayMouseMoveEvent(moveWithSelection);
```

### replayMouseClickEvent(event)
```javascript
replayMouseClickEvent(event: EasyMouseClickEvent): void
```
Simulates mouse clicks.

```javascript
// Example: Left click simulation
const leftClick = new EasyMouseClickEvent(
    Date.now(),
    100,  // x coordinate
    200,  // y coordinate
    0,    // mousedown
    0     // left button
);
replayer.replayMouseClickEvent(leftClick);

// Right click with focus
const rightClick = new EasyMouseClickEvent(
    Date.now(),
    150,
    250,
    0,    // mousedown
    2,    // right button
    document.querySelector('button')
);
replayer.replayMouseClickEvent(rightClick);
```

### replayKeyboardEvent(event)
```javascript
replayKeyboardEvent(event: EasyKeyboardEvent): void
```
Simulates keyboard input.

```javascript
// Example: Simple key press
const keyPress = new EasyKeyboardEvent(
    Date.now(),
    'a',
    0,    // keydown
    [false, false, false, false]  // no modifiers
);
replayer.replayKeyboardEvent(keyPress);

// Complex keyboard interaction
const ctrlShiftA = new EasyKeyboardEvent(
    Date.now(),
    'A',
    0,    // keydown
    [true, false, true, false],  // Ctrl+Shift
    document.querySelector('input'),
    { start: 0, end: 0 }
);
replayer.replayKeyboardEvent(ctrlShiftA);
```

### replayMutationEvent(event)
```javascript
replayMutationEvent(event: EasyMutationEvent): void
```
Applies DOM changes.

```javascript
// Example: Add element
const addNode = new EasyMutationEvent(
    Date.now(),
    {
        type: 'childList',
        target: document.getElementById('container'),
        nodes: [{
            action: 1,
            index: 0,
            html: '<div class="new">Content</div>',
            id: 'new-1'
        }]
    },
    (node) => node.id || 'generated-id'
);
replayer.replayMutationEvent(addNode);

// Modify attribute
const attrChange = new EasyMutationEvent(
    Date.now(),
    {
        type: 'attributes',
        target: document.querySelector('.target'),
        attributeName: 'class',
        newValue: 'target modified',
        oldValue: 'target'
    },
    null
);
replayer.replayMutationEvent(attrChange);
```

## DOM Management

### registerElements(element)
```javascript
registerElements(element: Element): void
```
Recursively maps element IDs.

```javascript
// Example: Register single element
const element = document.createElement('div');
element.setAttribute('easy-id', 'unique-1');
replayer.registerElements(element);

// Register complex structure
const container = document.createElement('div');
container.innerHTML = `
    <div easy-id="parent-1">
        <span easy-id="child-1">Text</span>
        <button easy-id="child-2">Click</button>
    </div>
`;
replayer.registerElements(container);
```

### parse(raw)
```javascript
parse(raw: Array): Array<EasyEvent>
```
Converts raw data to event objects.

```javascript
// Example: Parse raw events
const rawEvents = [
    { e: 0, t: 100, x: 100, y: 200 },              // Mouse move
    { e: 1, t: 200, x: 100, y: 200, p: 0, b: 0 },  // Mouse click
    { e: 2, t: 300, k: 'a', p: 0 }                 // Keyboard
];
const parsedEvents = replayer.parse(rawEvents);

// Parse with validation
const parseAndValidate = (raw) => {
    const events = replayer.parse(raw);
    return events.filter(event => event !== null);
};
const validEvents = parseAndValidate(rawEvents);
```

## Example Usage

```javascript
// Create replayer instance
const replayer = new EasyReplayer();

// Load session data
await replayer.load({
    recording: compressedEvents,
    styles: compressedStyles,
    elements: compressedDOM,
    scripts: compressedScripts
});

// Start replay
replayer.start();

// Load and start in one step
await replayer.load({
    recording: compressedEvents,
    styles: compressedStyles
}, true);
```

## Integration Notes

### 1. Setup Requirements
- Include EasyEvents classes
- Include EasyDecompress utility
- Configure visual components

### 2. Performance Considerations
- Event timing accuracy
- DOM mutation efficiency
- Memory management
- Script execution safety

### 3. Browser Support
Requires support for:
- DOM manipulation
- Event simulation
- Style management
- Modern JavaScript APIs

### 4. Visual Components
- Cursor visualization
- Selection indication
- Click effects
- Scroll animation

## Best Practices

1. **Resource Management**
   ```javascript
   // Load resources in optimal order
   await replayer.load({
       elements: domData,    // Load DOM first
       styles: styleData,    // Apply styles
       scripts: scriptData,  // Execute scripts
       recording: eventData  // Prepare events
   });
   ```

2. **Error Handling**
   ```javascript
   try {
       await replayer.load(replayData);
   } catch (error) {
       console.error('Replay loading failed:', error);
       // Clean up resources
   }
   ```

3. **Performance Optimization**
   ```javascript
   // Preload assets before starting replay
   await Promise.all([
       replayer.loadElements(domData),
       replayer.loadStyles(styleData)
   ]);
   ```

4. **State Management**
   ```javascript
   // Track replay progress
   replayer.currentEvent; // Current event index
   replayer.replayTime;  // Current replay time
   ```

## Notes

- Maintains timing fidelity of original recording
- Handles complex DOM mutations
- Supports script execution sequencing
- Provides visual feedback through cursor
- Manages element focus states
- Preserves event order and timing
- Supports pause/resume functionality
- Handles dynamic content changes

