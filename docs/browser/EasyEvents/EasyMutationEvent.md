# Browser Scripts - [EasyEvents.js](/scripts/EasyEvents.js) - EasyMutationEvent class

The `EasyMutationEvent` class extends `EasyEvent` to handle DOM mutation events. It captures changes to the DOM structure, including node additions, removals, and attribute modifications, along with the standard event information inherited from the base class.

## Constructor

```javascript
constructor(time, mutation, getUniqueID)
```

### Parameters

- `time` (number): The timestamp of the event in milliseconds
- `mutation` (Object): The mutation record containing:
  - `type` (string): Type of mutation
  - `target` (Node): Target DOM node
  - `nodes` (Array): Array of affected nodes
  - `attributeName` (string): Name of modified attribute (for attribute mutations)
  - `newValue` (string): New value of the attribute
  - `oldValue` (string): Previous value of the attribute
- `getUniqueID` (Function|null): Optional function to generate unique IDs for DOM nodes

## Properties

Inherits all properties from `EasyEvent` and adds:

- `type`: The type of mutation
- `target`: The target node's unique identifier
- `nodes`: Array of processed node information
- `attributeName`: Name of the modified attribute (if applicable)
- `newValue`: New value of the modified attribute
- `oldValue`: Previous value of the modified attribute

## Methods

### setUniqueIDsForChildren(originalNode, clonedNode, getUniqueID)

Recursively sets unique IDs for all child nodes in a cloned node structure.

#### Parameters
- `originalNode` (Node): The original DOM node
- `clonedNode` (Node): The cloned DOM node
- `getUniqueID` (Function): Function to generate unique IDs

### static parse(data)

Creates an `EasyMutationEvent` instance from a minimized data object.

#### Parameters
- `data` (Object): The minimized data object containing:
  - `t`: timestamp
  - `ty`: mutation type
  - `ta`: target node ID
  - `m`: array of mutation nodes
  - `at`: attribute name
  - `n`: new value
  - `o`: old value

#### Returns
- (EasyMutationEvent): A new instance of EasyMutationEvent

### toJSON()

Extends the base class's toJSON method to include mutation-specific properties.

#### Returns
- (Object): A plain object containing all event properties including mutation details

### min

Extends the base class's min getter to provide a minimized version of the mutation event data.

#### Returns
- (Object): A compressed object with shortened property names:
  - `e`: event type (always 4 for mutation events)
  - `t`: time
  - `ty`: mutation type
  - `ta`: target node ID
  - `m`: array of processed mutation nodes with:
    - `a`: action (0: remove, 1: add)
    - `ix`: index
    - `h`: HTML content
    - `i`: node ID (for element nodes)
    - `t`: text flag (for text nodes)
  - `at`: attribute name
  - `n`: new value
  - `o`: old value

## Example Usage

```javascript
// Create a mutation event for a node addition
const mutationEvent = new EasyMutationEvent(
    Date.now(),
    {
        type: "childList",
        target: document.getElementById("container"),
        nodes: [{
            action: 1,  // Add node
            index: 0,
            nodeType: Node.ELEMENT_NODE,
            cloneNode: () => someElement
        }]
    },
    (node) => node.getAttribute("data-id") || generateUniqueId()
);

// Get the minimized version for network transfer
const compressedEvent = mutationEvent.min;

// Parse a minimized event back into an instance
const parsedEvent = EasyMutationEvent.parse({
    t: 1634567890123,
    ty: "childList",
    ta: "container-1",
    m: [{
        a: 1,
        ix: 0,
        h: "<div class='new-element'>Content</div>",
        i: "element-1"
    }]
});
```

## Notes

- The class automatically sets the event type to "mutation" in the constructor
- The minimized version uses `e: 4` to indicate a mutation event type
- Supports both element nodes and text nodes
- Handles node additions and removals with proper index tracking
- Preserves DOM structure through HTML serialization
- Maintains unique node identification through the `getUniqueID` function
- Special handling for text nodes vs element nodes
- Efficiently processes and stores attribute mutations
- Supports deep cloning with unique ID preservation
- Provides comprehensive mutation tracking for DOM replay capabilities

