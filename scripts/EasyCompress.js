/**
 * Class providing methods for compressing data using Gzip compression.
 */
class EasyCompress {
    /**
     * Compresses a string using Gzip and returns the base64-encoded result.
     * @param {string} data - The string data to compress.
     * @returns {Promise<string>} A promise that resolves to the base64-encoded compressed data.
     */
    static async compress(data) {
        console.log(`Initial data size: ${data.length} bytes.`);
        const compressionStream = new CompressionStream("gzip");
        const writer = compressionStream.writable.getWriter();

        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);

        writer.write(encodedData);
        writer.close();

        const compressedStream = compressionStream.readable;
        const reader = compressedStream.getReader();

        let compressedChunks = [];
        let result;
        while (!(result = await reader.read()).done) {
            compressedChunks.push(result.value);
        }

        const compressedData = compressedChunks.reduce((acc, val) => acc.concat(Array.from(val)), []);
        const b64encoded = btoa(String.fromCharCode.apply(null, new Uint8Array(compressedData)));
        console.log(`Compressed data size: ${b64encoded.length} bytes.`);
        console.log(`Compression efficiency is ${((1 - b64encoded.length / data.length) * 100).toFixed(2)}%.`);
        return b64encoded;
    }
}
