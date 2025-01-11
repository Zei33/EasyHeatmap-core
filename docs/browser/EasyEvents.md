# Browser Scripts - [EasyEvents.js](/scripts/EasyEvents.js)

The EasyEvents collection is a comprehensive system for capturing, serializing, and replaying browser events. It provides a standardized way to handle various types of browser interactions while maintaining efficiency in network transfer through minimized data formats.

## Core Concept

All event classes extend the base [`EasyEvent`](./EasyEvents/EasyEvent.md) class, which provides common functionality for:
- Event timing
- Focused element tracking
- Cursor position management
- Data serialization
- Network-optimized data formats

## Event Types

The collection includes specialized event classes for different types of browser interactions:

1. [`EasyMouseMoveEvent`](./EasyEvents/EasyMouseMoveEvent.md)
   - Tracks mouse movement coordinates
   - Event type code: 0
   - Captures x/y positions

2. [`EasyMouseClickEvent`](./EasyEvents/EasyMouseClickEvent.md)
   - Handles mouse button interactions
   - Event type code: 1
   - Tracks button states (left/middle/right)
   - Supports both down and up phases

3. [`EasyKeyboardEvent`](./EasyEvents/EasyKeyboardEvent.md)
   - Manages keyboard interactions
   - Event type code: 2
   - Captures key presses with modifiers
   - Handles key down/up phases
   - Supports modifier keys (Ctrl, Alt, Shift, Meta)

4. [`EasyScrollEvent`](./EasyEvents/EasyScrollEvent.md)
   - Records scroll positions
   - Event type code: 3
   - Tracks both horizontal and vertical scroll

5. [`EasyMutationEvent`](./EasyEvents/EasyMutationEvent.md)
   - Captures DOM changes
   - Event type code: 4
   - Handles node additions/removals
   - Tracks attribute changes
   - Preserves DOM structure

## Common Features

### Focused Element Tracking
Most events can track the currently focused DOM element using:
- Element selectors
- Unique ID generation
- DOM path construction

### Cursor Position Management
For text input elements, events can track:
- Selection start
- Selection end
- Cursor placement

### Data Minimization
All events support efficient network transfer through:
- Shortened property names
- Optional field omission
- Numeric type codes
- Compressed representations

## Network Data Format

The minimized data format uses consistent key abbreviations:
- `e`: Event type (0-4)
- `t`: Timestamp
- `x`: X coordinate
- `y`: Y coordinate
- `b`: Button
- `k`: Key
- `p`: Phase
- `m`: Modifiers
- `f`: Focused element
- `c`: Cursor position
  - `s`: Selection start
  - `e`: Selection end

## Usage Example

```javascript
// Create different types of events
const mouseMove = new EasyMouseMoveEvent(Date.now(), 100, 200);
const keyPress = new EasyKeyboardEvent(
    Date.now(),
    'a',
    0,  // keydown
    [true, false, false, false]  // Ctrl pressed
);

// Get minimized versions for network transfer
const minimizedMouseMove = mouseMove.min;
const minimizedKeyPress = keyPress.min;

// Parse events from network data
const parsedMouseMove = EasyMouseMoveEvent.parse(minimizedMouseMove);
const parsedKeyPress = EasyKeyboardEvent.parse(minimizedKeyPress);
```

## Implementation Notes

- All events inherit from the base `EasyEvent` class
- Each event type has a unique numeric identifier
- Events can be serialized to JSON for storage
- Events support minimized formats for network transfer
- DOM element selectors are generated automatically
- Cursor positions are tracked for input elements
- Mutation events support deep DOM structure preservation
- All events maintain timing information
- Events can be parsed from minimized network data

