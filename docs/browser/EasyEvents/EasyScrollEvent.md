# Browser Scripts - [EasyEvents.js](../scripts/EasyEvents.js) - EasyScrollEvent class

The `EasyScrollEvent` class extends `EasyEvent` to handle scroll events. It captures scroll position coordinates along with the standard event information inherited from the base class. This class provides a simplified way to track and serialize scroll positions in the browser.

## Constructor

```javascript
constructor(time, x, y)
```

### Parameters

- `time` (number): The timestamp of the event in milliseconds
- `x` (number): The horizontal scroll position (scrollLeft)
- `y` (number): The vertical scroll position (scrollTop)

## Properties

Inherits all properties from `EasyEvent` and adds:

- `x`: The horizontal scroll position
- `y`: The vertical scroll position

## Methods

### static parse(data)

Creates an `EasyScrollEvent` instance from a minimized data object.

#### Parameters
- `data` (Object): The minimized data object containing:
  - `t`: timestamp
  - `x`: horizontal scroll position
  - `y`: vertical scroll position

#### Returns
- (EasyScrollEvent): A new instance of EasyScrollEvent

### toJSON()

Extends the base class's toJSON method to include scroll position coordinates.

#### Returns
- (Object): A plain object containing all event properties including x and y coordinates

### min

Extends the base class's min getter to provide a minimized version of the scroll event data.

#### Returns
- (Object): A compressed object with shortened property names:
  - `e`: event type (always 3 for scroll events)
  - `t`: time
  - `x`: horizontal scroll position
  - `y`: vertical scroll position

## Example Usage

```javascript
// Create a scroll event
const scrollEvent = new EasyScrollEvent(
    Date.now(),
    100,  // horizontal scroll position
    500   // vertical scroll position
);

// Get the minimized version for network transfer
const compressedEvent = scrollEvent.min;

// Parse a minimized event back into an instance
const parsedEvent = EasyScrollEvent.parse({
    t: 1634567890123,
    x: 100,
    y: 500
});
```

## Notes

- The class automatically sets the event type to "scroll" in the constructor
- The minimized version uses `e: 3` to indicate a scroll event type
- Unlike other event types, scroll events don't track focused elements or cursor positions
- Coordinates represent absolute scroll positions rather than relative movements
- Useful for capturing and replaying page scroll states
- Provides a lightweight representation for network transfer

