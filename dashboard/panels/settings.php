<div class="grid grid-cols-1 lg:grid-cols-2 gap-4" id="easy-settings-container">
	<form class="w-full">
		<label class="inline-flex items-center mb-3 cursor-pointer">
			<input type="checkbox" value="" class="sr-only peer" name="use-custom-base-url" id="use-custom-base-url">
			<div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
			<span class="ms-3 text-sm font-medium">Use Custom Base URL</span>
		</label>
		<div class="mt-1 mb-2 hidden" id="custom-base-url-container">
			<label for="custom-base-url" class="block mb-2 text-sm font-medium">Custom Base URL</label>
			<input type="text" id="custom-base-url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://example.com" required />
		</div>
		<p class="mb-2 text-xs">Set a custom base URL only if your dashboard uses a different domain name to the primary website. When disabled, recordings will use the page URL to determine the base URL.</p>
	</form>
	<div class="w-full">
		<form class="w-full mb-4">
			<div class="relative mb-8">
				<label for="heatmap-resolution-range">Heatmap Resolution</label>
				<input id="heatmap-resolution-range" type="range" value="1" min="1" max="168" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
				<span class="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">1 hour</span>
				<span id="current-heatmap-resolution-range" class="text-sm text-green-500 dark:text-green-400 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">1 hour</span>
				<span class="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">7 days</span>
			</div>
			<p class="mb-2 text-xs">Heatmap data will be collated into periods based on the resolution. A lower resolution will let you observe data down to that level (e.g. 1 hour will let you see heatmaps from hour to hour). But lower resolutions require more database capacity and resources.</p>
		</form>
		<form class="w-full mb-4">
			<label for="heatmap-breakpoints-select" class="block mb-2 text-sm font-medium">Heatmap Display Breakpoints</label>
			<select id="heatmap-breakpoints-select" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				<option value="bootstrap" selected>Bootstrap</option>
				<option value="tailwind">Tailwind</option>
				<option value="foundation">Foundation</option>
				<option value="custom">Custom</option>
			</select>
			<div class="flex justify-center">
				<button type="button" id="show-heatmap-breakpoints-list" class="w-full py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Show breakpoints</button>
			</div>
			<div id="heatmap-breakpoints-list-container" class="relative overflow-x-auto shadow-md sm:rounded-lg hidden">
				<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" class="px-6 py-3">
								Label
							</th>
							<th scope="col" class="px-6 py-3">
								Starting Pixels >=
							</th>
							<th scope="col" class="px-6 py-3">
								<span class="sr-only">Delete</span>
							</th>
						</tr>
					</thead>
					<tbody id="heatmap-breakpoints-list">
					</tbody>
				</table>
			</div>
			<p class="mt-2 text-xs">Users have many different display sizes and responsive websites will adjust their layout to support them. If you use a popular responsive framework, select it from the list. Otherwise you can setup your own. Then your heatmap data will be organised by display size.</p>
		</form>
	</div>
</div>