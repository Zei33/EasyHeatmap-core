<div class="grid grid-cols-1 lg:grid-cols-2 gap-4" id="easy-settings-container">
	<form class="w-full">
		<label class="inline-flex items-center mb-3 cursor-pointer">
			<input type="checkbox" value="" class="sr-only peer" name="use-custom-base-url" id="use-custom-base-url">
			<div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
			<span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Use Custom Base URL</span>
		</label>
		<div class="mt-1 mb-2 hidden" id="custom-base-url-container">
			<label for="custom-base-url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Custom Base URL</label>
			<input type="text" id="custom-base-url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://example.com" required />
		</div>
		<p class="mb-2 text-xs">Set a custom base URL only if your dashboard uses a different domain name to the primary website. When disabled, recordings will use the page URL to determine the base URL.</p>
	</form>
</div>