# Browser Scripts - EasyReplayer.js - EasyCursor class

The `EasyCursor` class provides visual cursor simulation during session replay. It creates and manages a visual cursor element that mimics the original user's mouse movements and interactions.

## Constructor

```javascript
constructor()
```

Creates and initializes the visual cursor element:
- Adds required CSS classes
- Appends to document body
- Sets up initial state

## Methods

### setPosition(x, y)
```javascript
setPosition(x: number, y: number): void
```

Positions the cursor element on screen.

#### Parameters
- `x`: Horizontal position in pixels
- `y`: Vertical position in pixels

### setButton(button)
```javascript
setButton(button: number): void
```

Updates cursor state based on mouse button.

#### Parameters
- `button`: Button state
  - `-1`: No button pressed
  - `0`: Left button
  - `2`: Right button
  - Other: Other button

### setSelection(event)
```javascript
setSelection(event: EasyEvent): void
```

Manages text selection in input elements.

#### Parameters
- `event`: Event containing selection data

### click(event)
```javascript
click(event: EasyEvent): void
```

Simulates click behavior:
- Manages focus states
- Triggers focus/blur events
- Updates cursor appearance

## CSS Classes

- `.easy-replayer`: Base class
- `.cursor`: Cursor styling
- `.left`: Left click state
- `.right`: Right click state
- `.other`: Other button state

## Example Usage

```javascript
// Create cursor instance
const cursor = new EasyCursor();

// Move cursor
cursor.setPosition(100, 200);

// Simulate left click
cursor.setButton(0);

// Release button
cursor.setButton(-1);
```

## Notes

- Provides visual feedback for mouse interactions
- Handles different button states
- Manages element focus
- Supports text selection visualization
- Integrates with EasyReplayer for session replay
