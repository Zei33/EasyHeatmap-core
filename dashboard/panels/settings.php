<?php 
	require_once("../classes/EasyLoc.php");
	require_once("../../shared/classes/EasySettings.php");
?>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4" id="easy-settings-container">
	<div class="w-full">
		<form class="w-full mb-5">
			<label class="inline-flex items-center mb-3 cursor-pointer">
				<input type="checkbox" class="sr-only peer" id="use-custom-base-url">
				<div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				<span class="ms-3 text-sm font-medium"><?php $EL->echo("USE_CUSTOM_BASE_URL"); ?></span>
			</label>
			<div class="mt-1 mb-2 hidden" id="custom-base-url-container">
				<label for="custom-base-url" class="block mb-2 text-sm font-medium"><?php $EL->echo("CUSTOM_BASE_URL"); ?></label>
				<input type="text" id="custom-base-url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://example.com" />
			</div>
			<p class="mb-2 text-xs"><?php $EL->echo("USE_CUSTOM_BASE_URL_EXPLANATION"); ?></p>
		</form>
		<form class="w-full mb-3">
			<label class="inline-flex items-center mb-3 cursor-pointer">
				<input type="checkbox" class="sr-only peer" id="capture-keyboard" checked>
				<div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				<span class="ms-3 text-sm font-medium"><?php $EL->echo("CAPTURE_KEY_STROKES"); ?></span>
			</label>
			<p class="mb-2 text-xs"><?php $EL->echo("CAPTURE_KEY_STROKES_EXPLANATION"); ?></p>
		</form>
		<form class="w-full mb-5">
			<div class="mt-1 mb-2">
				<label for="keyboard-ignore-class" class="block mb-2 text-sm font-medium"><?php $EL->echo("IGNORE_KEY_STROKES"); ?></label>
				<input type="text" id="keyboard-ignore-class" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="easy-ignore" />
			</div>
			<p class="mb-2 text-xs"><?php $EL->echo("IGNORE_KEY_STROKES_EXPLANATION"); ?></p>
		</form>
		<form class="w-full mb-5">
			<label class="inline-flex items-center mb-3 cursor-pointer">
				<input type="checkbox" class="sr-only peer" id="record-external">
				<div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				<span class="ms-3 text-sm font-medium"><?php $EL->echo("RECORD_EXTERNAL_RESOURCES"); ?></span>
			</label>
			<p class="mb-2 text-xs"><?php $EL->echo("RECORD_EXTERNAL_RESOURCES_EXPLANATION"); ?></p>
		</form>
		<form class="w-full mb-4">
			<div class="relative mb-8">
				<label for="recording-frequency-range" class="block mb-1 text-sm font-medium"><?php $EL->echo("RECORDING_MOUSE_FREQUENCY"); ?></label>
				<input id="recording-frequency-range" type="range" value="10" min="0" max="400" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
				<span class="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">0ms</span>
				<span id="current-recording-frequency-range" class="text-sm text-green-500 dark:text-green-400 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">10ms</span>
				<span class="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">400ms</span>
			</div>
			<p class="mb-2 text-xs"><?php $EL->echo("RECORDING_MOUSE_FREQUENCY_EXPLANATION"); ?></p>
		</form>
		<form class="w-full mb-4">
			<label for="recoridng-strategy-select" class="block mb-2 text-sm font-medium"><?php $EL->echo("RECORDING_TRIGGER_STRATEGY"); ?></label>
			<select id="recording-strategy-select" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				<option value="url" selected><?php $EL->echo("RECORDING_TRIGGER_OPTION_URL"); ?></option>
				<option value="url-query"><?php $EL->echo("RECORDING_TRIGGER_OPTION_URL_QUERY"); ?></option>
				<option value="code"><?php $EL->echo("RECORDING_TRIGGER_OPTION_CODE"); ?></option>
			</select>
			<p class="text-xs text-yellow-500" id="recording-strategy-info"></p>
			<p class="mb-2 text-xs" id="recording-strategy-example"></p>
			<p class="mb-2 text-xs"><?php $EL->echo("RECORDING_TRIGGER_STRATEGY_EXPLANATION"); ?></p>
		</form>
	</div>
	<div class="w-full">
		<form class="w-full mb-4">
			<div class="relative mb-8">
				<label for="heatmap-resolution-range" class="block mb-1 text-sm font-medium"><?php $EL->echo("HEATMAP_RESOLUTION"); ?></label>
				<input id="heatmap-resolution-range" type="range" value="6" min="1" max="168" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
				<span class="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">1 hour</span>
				<span id="current-heatmap-resolution-range" class="text-sm text-green-500 dark:text-green-400 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">6 hours</span>
				<span class="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">7 days</span>
			</div>
			<p class="mb-2 text-xs"><?php $EL->echo("HEATMAP_RESOLUTION_EXPLANATION"); ?></p>
		</form>
		<form class="w-full mb-4">
			<div class="relative mb-8">
				<label for="heatmap-precision-range" class="block mb-1 text-sm font-medium"><?php $EL->echo("HEATMAP_MOUSE_PRECISION"); ?></label>
				<input id="heatmap-precision-range" type="range" value="4" min="1" max="16" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
				<span class="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">1 pixel</span>
				<span id="current-heatmap-precision-range" class="text-sm text-green-500 dark:text-green-400 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">4 pixels</span>
				<span class="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">16 pixels</span>
			</div>
			<p class="mb-2 text-xs"><?php $EL->echo("HEATMAP_MOUSE_PRECISION_EXPLANATION"); ?></p>
		</form>
		<form class="w-full mb-4">
			<label for="heatmap-breakpoints-select" class="block mb-2 text-sm font-medium"><?php $EL->echo("HEATMAP_DISPLAY_BREAKPOINTS"); ?></label>
			<select id="heatmap-breakpoints-select" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				<option value="bootstrap" selected><?php $EL->echo("BOOTSTRAP"); ?></option>
				<option value="tailwind"><?php $EL->echo("TAILWIND"); ?></option>
				<option value="foundation"><?php $EL->echo("FOUNDATION"); ?></option>
				<option value="custom"><?php $EL->echo("CUSTOM"); ?></option>
			</select>
			<div class="flex justify-center">
				<button type="button" id="show-heatmap-breakpoints-list" class="w-full py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"><?php $EL->echo("SHOW_BREAKPOINTS"); ?></button>
			</div>
			<div id="heatmap-breakpoints-list-container" class="relative overflow-x-auto shadow-md sm:rounded-lg hidden">
				<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" class="px-6 py-3">
							<?php $EL->echo("LABEL"); ?>
							</th>
							<th scope="col" class="px-6 py-3">
							<?php $EL->echo("STARTING_PIXELS_>="); ?>
							</th>
							<th scope="col" class="px-6 py-3">
								<span class="sr-only"><?php $EL->echo("DELETE"); ?></span>
							</th>
						</tr>
					</thead>
					<tbody id="heatmap-breakpoints-list">
					</tbody>
				</table>
			</div>
			<p class="mt-2 text-xs"><?php $EL->echo("HEATMAP_DISPLAY_BREAKPOINTS_EXPLANATION"); ?></p>
		</form>
	</div>
</div>