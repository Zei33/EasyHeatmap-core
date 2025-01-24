# Browser Scripts - EasyReplayer.js - EasyStyles class

The `EasyStyles` class manages the application of CSS styles during session replay. It handles the creation and injection of style elements into the document head.

## Constructor

```javascript
constructor(data: Array<string>)
```

### Parameters
- `data`: Array of CSS style strings

### Process
1. Creates style elements for each CSS string
2. Injects styles into document head
3. Maintains references to created elements

## Example Usage

```javascript
// Create styles manager with array of CSS
const styles = new EasyStyles([
    'body { background: #fff; }',
    '.custom-class { color: blue; }'
]);

// Styles are automatically injected into document
```

## Notes

- Automatically injects styles on instantiation
- Maintains style element references
- Handles multiple style blocks
- Integrates with EasyReplayer for session replay
