# Browser Scripts - [EasyDecompress.js](/scripts/EasyDecompress.js) - EasyDecompress class

The `EasyDecompress` class provides a streamlined interface for decompressing Gzip-compressed, base64-encoded data in the browser. It utilizes the Decompression Streams API to perform efficient data decompression and restore the original string content.

## Methods

### static async decompress(data)

Decompresses a base64-encoded, Gzip-compressed string back to its original form.

```javascript
static async decompress(data: string): Promise<string>
```

#### Parameters
- `data` (string): The base64-encoded, Gzip-compressed string to decompress

#### Returns
- (Promise<string>): A promise that resolves to the original decompressed string

#### Process
1. Decodes base64 input to binary data
2. Creates a Gzip decompression stream
3. Writes the binary data to the decompression stream
4. Reads the decompressed chunks
5. Concatenates chunks into a single Uint8Array
6. Decodes the binary data back to a string using UTF-8

## Example Usage

```javascript
// Decompress a previously compressed string
try {
    const compressedData = "H4sIAAAAAAAAA6tWSs5PSVWyMjIwqAUAoZBP..."; // Base64 compressed data
    const original = await EasyDecompress.decompress(compressedData);
    console.log('Decompressed data:', original);
    
    // Parse JSON if the original was JSON
    const jsonData = JSON.parse(original);
} catch (error) {
    console.error('Decompression failed:', error);
}
```

## Technical Details

### Decompression
- Uses the Decompression Streams API
- Implements Gzip decompression algorithm
- Processes data in chunks for memory efficiency

### Encoding/Decoding
- Input: Base64-encoded compressed data
- Intermediate: Uint8Array for binary processing
- Output: UTF-8 text decoding

## Browser Compatibility

Requires browsers that support:
- Decompression Streams API
- TextDecoder
- Base64 decoding (atob)
- Typed Arrays

## Notes

- Designed for browser-side decompression
- Asynchronous operation for better performance
- Memory-efficient chunk processing
- Pairs with EasyCompress for complete compression/decompression workflow
- Handles UTF-8 encoded text data
- Suitable for decompressing event data, logs, or any string content

## Best Practices

1. **Error Handling**
   ```javascript
   try {
       const decompressed = await EasyDecompress.decompress(compressedString);
   } catch (error) {
       // Handle decompression errors
       if (error instanceof TypeError) {
           console.error('Invalid compressed data format');
       } else {
           console.error('Decompression failed:', error);
       }
   }
   ```

2. **Large Data Sets**
   ```javascript
   // For large compressed data sets, consider processing in sequence
   const compressedChunks = [...]; // Array of compressed chunks
   const decompressedChunks = [];
   
   for (const chunk of compressedChunks) {
       const decompressed = await EasyDecompress.decompress(chunk);
       decompressedChunks.push(decompressed);
   }
   
   const fullData = decompressedChunks.join('');
   ```

3. **Data Validation**
   ```javascript
   // Validate decompressed data integrity
   async function safeDecompress(compressedData) {
       try {
           const decompressed = await EasyDecompress.decompress(compressedData);
           
           // Verify the data structure if expecting JSON
           JSON.parse(decompressed); // Will throw if not valid JSON
           
           return decompressed;
       } catch (error) {
           console.error('Data validation failed:', error);
           throw new Error('Invalid compressed data');
       }
   }
   ```

## Integration with EasyCompress

```javascript
// Complete compression/decompression cycle
async function compressAndDecompress(originalData) {
    try {
        // Compress the data
        const compressed = await EasyCompress.compress(originalData);
        
        // Decompress back to original
        const decompressed = await EasyDecompress.decompress(compressed);
        
        // Verify data integrity
        console.assert(originalData === decompressed, 'Data integrity check failed');
        
        return decompressed;
    } catch (error) {
        console.error('Processing failed:', error);
        throw error;
    }
}
```

