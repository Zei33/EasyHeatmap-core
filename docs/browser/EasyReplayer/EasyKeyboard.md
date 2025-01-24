# Browser Scripts - EasyReplayer.js - EasyKeyboard class

The `EasyKeyboard` class provides keyboard event simulation during session replay. It handles key press events, modifier keys, and input field updates.

## Static Methods

### static typeKey(event)
```javascript
static typeKey(event: EasyKeyboardEvent): void
```

Simulates keyboard input events.

#### Parameters
- `event`: Keyboard event containing:
  - `key`: Key being pressed
  - `phase`: Key state (down/up)
  - `mods`: Active modifier keys
  - `focusedElement`: Target element
  - `cursorPosition`: Text selection/cursor position

#### Process
1. Manages element focus
2. Dispatches keyboard events
3. Updates input field content
4. Handles modifier keys

## Features

### Event Simulation
- Keydown/keyup events
- Modifier key states (Ctrl, Alt, Shift, Meta)
- Input field value updates
- Focus management

### Input Handling
- Text input fields
- Textarea elements
- Cursor position
- Text selection

## Example Usage

```javascript
// Simulate key press
EasyKeyboard.typeKey(new EasyKeyboardEvent(
    Date.now(),
    'a',
    0,  // keydown
    [false, false, false, false],  // no modifiers
    document.querySelector('input')
));

// Simulate with modifiers
EasyKeyboard.typeKey(new EasyKeyboardEvent(
    Date.now(),
    'A',
    0,
    [false, false, true, false]  // Shift pressed
));
```

## Notes

- Handles complex keyboard interactions
- Supports modifier key combinations
- Manages input field states
- Preserves cursor positions
- Integrates with EasyReplayer for session replay
- TODO: Needs expansion for more key command combinations
