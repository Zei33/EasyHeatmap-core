# Browser Scripts - [EasyCompress.js](/scripts/EasyCompress.js) - EasyCompress class

The `EasyCompress` class provides a streamlined interface for compressing string data using Gzip compression in the browser. It utilizes the Compression Streams API to perform efficient data compression and outputs base64-encoded results.

## Methods

### static async compress(data)

Compresses a string using Gzip compression and returns the result as a base64-encoded string.

```javascript
static async compress(data: string): Promise<string>
```

#### Parameters
- `data` (string): The input string to be compressed

#### Returns
- (Promise<string>): A promise that resolves to the base64-encoded compressed data

#### Process
1. Creates a Gzip compression stream
2. Encodes the input string to UTF-8
3. Writes the encoded data to the compression stream
4. Reads the compressed chunks
5. Concatenates and converts to base64
6. Logs compression statistics

## Example Usage

```javascript
// Compress a JSON string
const data = JSON.stringify({
    events: [
        { type: "click", x: 100, y: 200 },
        { type: "scroll", position: 500 }
    ]
});

try {
    const compressed = await EasyCompress.compress(data);
    console.log('Compressed data:', compressed);
} catch (error) {
    console.error('Compression failed:', error);
}
```

## Performance Metrics

The class provides automatic logging of compression metrics:
- Initial data size (bytes)
- Compressed data size (bytes)
- Compression efficiency percentage

Example console output:
```
Initial data size: 1000 bytes.
Compressed data size: 450 bytes.
Compression efficiency is 55.00%.
```

## Technical Details

### Compression
- Uses the Compression Streams API
- Implements Gzip compression algorithm
- Processes data in chunks for memory efficiency

### Encoding
- Input: UTF-8 text encoding
- Output: Base64 encoding
- Intermediate: Uint8Array for binary processing

## Browser Compatibility

Requires browsers that support:
- Compression Streams API
- TextEncoder
- Base64 encoding (btoa)
- Typed Arrays

## Notes

- Designed for browser-side compression
- Asynchronous operation for better performance
- Includes built-in compression statistics
- Memory-efficient chunk processing
- Suitable for compressing event data, logs, or any string content
- Base64 output is safe for network transmission

## Best Practices

1. **Error Handling**
   ```javascript
   try {
       const compressed = await EasyCompress.compress(largeString);
   } catch (error) {
       // Handle compression errors
   }
   ```

2. **Large Data Sets**
   ```javascript
   // For large data sets, consider compression in smaller chunks
   const chunks = splitIntoChunks(largeData);
   const compressedChunks = await Promise.all(
       chunks.map(chunk => EasyCompress.compress(chunk))
   );
   ```

3. **Monitoring**
   ```javascript
   // Monitor compression ratios
   const originalSize = data.length;
   const compressed = await EasyCompress.compress(data);
   const compressionRatio = compressed.length / originalSize;
   
   if (compressionRatio > 0.9) {
       console.warn('Poor compression ratio detected');
   }
   ```

