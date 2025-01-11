# Browser Scripts - [EasyEvents.js](/scripts/EasyEvents.js) - EasyKeyboardEvent class

The `EasyKeyboardEvent` class extends `EasyEvent` to handle keyboard events. It captures key presses, their phases (down/up), and modifier key states along with the standard event information inherited from the base class.

## Constructor

```javascript
constructor(time, key, phase, mods, focusedElement = null, cursorPosition = null)
```

### Parameters

- `time` (number): The timestamp of the event in milliseconds
- `key` (string): The key that was pressed
- `phase` (number): The key press phase:
  - `0`: Key down
  - `1`: Key up
- `mods` (Array<boolean>): Array of modifier key states [Ctrl, Alt, Shift, Meta]
  - Index 0: Ctrl key state
  - Index 1: Alt key state
  - Index 2: Shift key state
  - Index 3: Meta key state (Command on Mac, Windows key on PC)
- `focusedElement` (Element|string|null, optional): The DOM element that has focus, or its selector string. Defaults to null
- `cursorPosition` (Object|null, optional): The cursor position information. Defaults to null

## Properties

Inherits all properties from `EasyEvent` and adds:

- `key`: The key that was pressed
- `phase`: The key press phase (down/up)
- `mods`: Array of active modifier indices (e.g., [0, 2] means Ctrl and Shift are active)
- `focusedElement`: The focused element's selector or null
- `cursorPosition`: Cursor position information for input elements

## Methods

### parseMods(mods)

Converts a boolean array of modifier states into an array of active modifier indices.

#### Parameters
- `mods` (Array<boolean>): Array of modifier key states [Ctrl, Alt, Shift, Meta]

#### Returns
- (Array<number>): Array of indices for active modifiers

### static parse(data)

Creates an `EasyKeyboardEvent` instance from a minimized data object.

#### Parameters
- `data` (Object): The minimized data object containing:
  - `t`: timestamp
  - `k`: key
  - `p`: phase
  - `m` (optional): active modifier indices
  - `f` (optional): focused element selector
  - `c` (optional): cursor position with `s` (start) and `e` (end) properties

#### Returns
- (EasyKeyboardEvent): A new instance of EasyKeyboardEvent

### toJSON()

Extends the base class's toJSON method to include keyboard-specific properties.

#### Returns
- (Object): A plain object containing all event properties including key, phase, and modifier information

### min

Extends the base class's min getter to provide a minimized version of the keyboard event data.

#### Returns
- (Object): A compressed object with shortened property names:
  - `e`: event type (always 2 for keyboard events)
  - `t`: time
  - `k`: key
  - `p`: phase
  - `m`: active modifier indices (if any)
  - `f`: focusedElement (if present)
  - `c`: cursorPosition (if present) with `s` (start) and `e` (end) properties

## Example Usage

```javascript
// Create a Ctrl+Shift+A keydown event
const keyDownEvent = new EasyKeyboardEvent(
    Date.now(),
    'a',           // key
    0,             // phase: down
    [true, false, true, false]  // mods: [Ctrl, Alt, Shift, Meta]
);

// Create a simple key up event
const keyUpEvent = new EasyKeyboardEvent(
    Date.now(),
    'b',           // key
    1,             // phase: up
    [false, false, false, false]  // no modifiers
);

// Get the minimized version for network transfer
const compressedEvent = keyDownEvent.min;

// Parse a minimized event back into an instance
const parsedEvent = EasyKeyboardEvent.parse({
    t: 1634567890123,
    k: 'a',
    p: 0,
    m: [0, 2]  // Ctrl and Shift active
});
```

## Notes

- The class automatically sets the event type to "keyboard" in the constructor
- The minimized version uses `e: 2` to indicate a keyboard event type
- Modifier keys are stored efficiently as indices of active modifiers
- Supports both key down and key up events
- Can track multiple modifier keys simultaneously
- Special handling for cursor position in text input elements
- Inherits all functionality for handling focused elements from the base `EasyEvent` class
- The `parseMods` method efficiently converts boolean states to active indices

