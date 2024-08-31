class EasyDecompress {
	static async decompress(data) {
		const binaryString = atob(data);
		const binary = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			binary[i] = binaryString.charCodeAt(i);
		}

		const decompressionStream = new DecompressionStream("gzip");
		const writer = decompressionStream.writable.getWriter();
		writer.write(binary);
		writer.close();

		const decompressedStream = decompressionStream.readable;
		const reader = decompressedStream.getReader();
		
		let decompressedChunks = [];
		let result;
		while (!(result = await reader.read()).done) {
			decompressedChunks.push(result.value);
		}

		const decompressedData = new Uint8Array(decompressedChunks.reduce((acc, val) => acc.concat(Array.from(val)), []));
		
		const decoder = new TextDecoder();
		const decodedData = decoder.decode(decompressedData);

		return decodedData;
	}
}