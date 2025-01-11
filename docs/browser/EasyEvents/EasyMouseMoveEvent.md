# Browser Scripts - [EasyEvents.js](/scripts/EasyEvents.js) - EasyMouseMoveEvent class

> [EasyEvents Overview](../EasyEvents.md)

The `EasyMouseMoveEvent` class extends `EasyEvent` to specifically handle mouse movement events. It captures mouse coordinates along with the standard event information inherited from the base class.

## Constructor

```javascript
constructor(time, x, y, focusedElement = null, cursorPosition = null)
```

### Parameters

- `time` (number): The timestamp of the event in milliseconds
- `x` (number): The x-coordinate of the mouse position
- `y` (number): The y-coordinate of the mouse position
- `focusedElement` (Element|string|null, optional): The DOM element that has focus, or its selector string. Defaults to null
- `cursorPosition` (Object|null, optional): The cursor position information. Defaults to null

## Properties

Inherits all properties from `EasyEvent` and adds:

- `x`: The x-coordinate of the mouse position
- `y`: The y-coordinate of the mouse position

## Methods

### static parse(data)

Creates an `EasyMouseMoveEvent` instance from a minimized data object.

#### Parameters
- `data` (Object): The minimized data object containing:
  - `t`: timestamp
  - `x`: x-coordinate
  - `y`: y-coordinate
  - `f` (optional): focused element selector
  - `c` (optional): cursor position with `s` (start) and `e` (end) properties

#### Returns
- (EasyMouseMoveEvent): A new instance of EasyMouseMoveEvent

### toJSON()

Extends the base class's toJSON method to include mouse coordinates.

#### Returns
- (Object): A plain object containing all event properties including x and y coordinates

### min

Extends the base class's min getter to provide a minimized version of the mouse move event data.

#### Returns
- (Object): A compressed object with shortened property names:
  - `e`: event type (always 0 for mouse move events)
  - `t`: time
  - `x`: x-coordinate
  - `y`: y-coordinate
  - `f`: focusedElement (if present)
  - `c`: cursorPosition (if present) with `s` (start) and `e` (end) properties

## Example Usage

```javascript
// Create a mouse move event
const mouseMoveEvent = new EasyMouseMoveEvent(
    Date.now(),
    100,  // x coordinate
    200   // y coordinate
);

// Get the minimized version for network transfer
const compressedEvent = mouseMoveEvent.min;

// Parse a minimized event back into an instance
const parsedEvent = EasyMouseMoveEvent.parse({
    t: 1634567890123,
    x: 100,
    y: 200
});
```

## Notes

- The class automatically sets the event type to "mouse" in the constructor
- The minimized version uses `e: 0` to indicate a mouse move event type
- All coordinate values are preserved in both full and minimized formats
- Inherits all functionality for handling focused elements and cursor positions from the base `EasyEvent` class

