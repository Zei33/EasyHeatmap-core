# Browser Scripts - [EasyEvents.js](../scripts/EasyEvents.js) - EasyEvent class

The `EasyEvent` class is designed to capture and standardize browser events along with their contextual information, such as timing, focused elements, and cursor positions. This class is particularly useful for tracking user interactions and maintaining a consistent event format across different browser contexts.

## Constructor

```javascript
constructor(event, time, focusedElement = null, cursorPosition = null)
```

### Parameters

- `event` (string): The type of event being captured
- `time` (number): The timestamp of the event in milliseconds
- `focusedElement` (Element|string|null, optional): The DOM element that has focus, or its selector string. Defaults to null
- `cursorPosition` (Object|null, optional): The cursor position information. Defaults to null

## Properties

- `event`: The event type
- `time`: The timestamp of the event
- `focusedElement`: A unique selector string representing the focused element
- `cursorPosition`: An object containing cursor position information (for input/textarea elements)

## Methods

### uniqueElementSelector(element)

Creates a unique CSS selector string for a given DOM element.

#### Parameters
- `element` (Element): The DOM element to create a selector for

#### Returns
- (string): A unique CSS selector that can identify the element in the DOM

### getCursorPosition(element)

Retrieves the cursor position information from input or textarea elements.

#### Parameters
- `element` (Element): The input or textarea element to get cursor position from

#### Returns
- (Object|null): An object containing `start` and `end` positions, or null if not applicable

### toJSON()

Converts the event instance to a JSON-serializable object.

#### Returns
- (Object): A plain object containing all event properties

### min

A getter that provides a minimized version of the event data for efficient network transfer.

#### Returns
- (Object): A compressed object with shortened property names:
  - `e`: event
  - `t`: time
  - `f`: focusedElement (if present)
  - `c`: cursorPosition (if present) with `s` (start) and `e` (end) properties

## Example Usage

```javascript
// Create a basic event
const basicEvent = new EasyEvent('click', Date.now());

// Create an event with a focused element
const inputEvent = new EasyEvent(
    'input',
    Date.now(),
    document.getElementById('username-input')
);

// Get the minimized version for network transfer
const compressedEvent = inputEvent.min;
```

## Notes

- The class automatically generates unique selectors for DOM elements using class names, tag names, and nth-child relationships
- Cursor position tracking is only available for input and textarea elements
- The minimized version (`min` getter) is optimized for network transfer while maintaining all essential information

