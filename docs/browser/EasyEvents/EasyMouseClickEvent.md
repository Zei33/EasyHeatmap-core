# Browser Scripts - [EasyEvents.js](../scripts/EasyEvents.js) - EasyMouseClickEvent class

The `EasyMouseClickEvent` class extends `EasyEvent` to handle mouse click events. It captures mouse coordinates, click phase (down/up), and button information along with the standard event information inherited from the base class.

## Constructor

```javascript
constructor(time, x, y, phase, button, focusedElement = null, cursorPosition = null)
```

### Parameters

- `time` (number): The timestamp of the event in milliseconds
- `x` (number): The x-coordinate of the mouse position
- `y` (number): The y-coordinate of the mouse position
- `phase` (number): The click phase:
  - `0`: Mouse button down
  - `1`: Mouse button up
- `button` (number): The mouse button that was clicked:
  - `0`: Left button
  - `1`: Middle button
  - `2`: Right button
- `focusedElement` (Element|string|null, optional): The DOM element that has focus, or its selector string. Defaults to null
- `cursorPosition` (Object|null, optional): The cursor position information. Defaults to null

## Properties

Inherits all properties from `EasyEvent` and adds:

- `x`: The x-coordinate of the mouse position
- `y`: The y-coordinate of the mouse position
- `phase`: The click phase (down/up)
- `button`: The mouse button that was clicked

## Methods

### static parse(data)

Creates an `EasyMouseClickEvent` instance from a minimized data object.

#### Parameters
- `data` (Object): The minimized data object containing:
  - `t`: timestamp
  - `x`: x-coordinate
  - `y`: y-coordinate
  - `p`: phase
  - `b`: button
  - `f` (optional): focused element selector
  - `c` (optional): cursor position with `s` (start) and `e` (end) properties

#### Returns
- (EasyMouseClickEvent): A new instance of EasyMouseClickEvent

### toJSON()

Extends the base class's toJSON method to include mouse click-specific properties.

#### Returns
- (Object): A plain object containing all event properties including x, y coordinates, phase, and button information

### min

Extends the base class's min getter to provide a minimized version of the mouse click event data.

#### Returns
- (Object): A compressed object with shortened property names:
  - `e`: event type (always 1 for mouse click events)
  - `t`: time
  - `x`: x-coordinate
  - `y`: y-coordinate
  - `p`: phase
  - `b`: button
  - `f`: focusedElement (if present)
  - `c`: cursorPosition (if present) with `s` (start) and `e` (end) properties

## Example Usage

```javascript
// Create a left mouse button down event
const mouseDownEvent = new EasyMouseClickEvent(
    Date.now(),
    100,  // x coordinate
    200,  // y coordinate
    0,    // phase: down
    0     // button: left
);

// Create a right mouse button up event
const mouseUpEvent = new EasyMouseClickEvent(
    Date.now(),
    150,  // x coordinate
    250,  // y coordinate
    1,    // phase: up
    2     // button: right
);

// Get the minimized version for network transfer
const compressedEvent = mouseDownEvent.min;

// Parse a minimized event back into an instance
const parsedEvent = EasyMouseClickEvent.parse({
    t: 1634567890123,
    x: 100,
    y: 200,
    p: 0,
    b: 0
});
```

## Notes

- The class automatically sets the event type to "click" in the constructor
- The minimized version uses `e: 1` to indicate a mouse click event type
- All coordinate values and click information are preserved in both full and minimized formats
- Supports tracking both mouse button down and up events
- Distinguishes between left, middle, and right mouse buttons
- Inherits all functionality for handling focused elements and cursor positions from the base `EasyEvent` class

