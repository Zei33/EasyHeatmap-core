/**
 * Class representing the EasySettings functionality.
 */
class EasySettings {
    /**
     * Create EasySettings.
     * @param {Object} dashboard - The dashboard instance.
     * @param {Object} settings - The settings object.
     */
    constructor(dashboard, settings) {
        this.dashboard = dashboard;
        this.settingsContainer = null;
        this.init();
    }

    /**
     * Initialize the settings by binding events and setting up the UI.
     */
    init() {
        this.settingsContainer = this.dashboard.contentContainer.querySelector('#easy-settings-container');
        this.bindButtons();
        this.bindHeatmapResolutionRange();
        this.bindHeatmapBreakpointSelect();
        this.bindHeatmapPrecisionRange();
        this.bindRecordingFrequencyRange();
        this.bindRecordingStrategySelect();
    }

    /**
     * Bind events to buttons in the settings container.
     */
    bindButtons() {
        this.settingsContainer.querySelector('#use-custom-base-url').addEventListener('change', (event) => {
            const customBaseUrlContainer = this.settingsContainer.querySelector('#custom-base-url-container');
            
            if (event.target.checked) {
                customBaseUrlContainer.classList.remove('hidden');
            } else {
                customBaseUrlContainer.classList.add('hidden');
            }
        });
    }

    /**
     * Bind the heatmap resolution range input and update its display.
     */
    bindHeatmapResolutionRange() {
        const rangeElement = this.settingsContainer.querySelector('#heatmap-resolution-range');
        const currentValueElement = this.settingsContainer.querySelector('#current-heatmap-resolution-range');
        const snapValues = [1, 2, 3, 6, 12, 24, 48, 72, 96, 120, 144, 168];

        rangeElement.addEventListener('input', function() {
            const closestValue = snapValues.reduce((prev, curr) => {
                return (Math.abs(curr - rangeElement.value) < Math.abs(prev - rangeElement.value) ? curr : prev);
            });
            rangeElement.value = closestValue;
    
            if (closestValue >= 24) {
                const days = closestValue / 24;
                currentValueElement.textContent = `${days} ${days === 1 ? 'day' : 'days'}`;
            } else {
                currentValueElement.textContent = `${closestValue} ${closestValue === 1 ? 'hour' : 'hours'}`;
            }
        });
    }

    /**
     * Bind the heatmap precision range input and update its display.
     */
    bindHeatmapPrecisionRange() {
        const rangeElement = this.settingsContainer.querySelector('#heatmap-precision-range');
        const currentValueElement = this.settingsContainer.querySelector('#current-heatmap-precision-range');
        const snapValues = [1, 2, 4, 8, 16];

        rangeElement.addEventListener('input', function() {
            const closestValue = snapValues.reduce((prev, curr) => {
                return (Math.abs(curr - rangeElement.value) < Math.abs(prev - rangeElement.value) ? curr : prev);
            });
            rangeElement.value = closestValue;
    
            currentValueElement.textContent = `${closestValue} ${closestValue === 1 ? 'pixel' : 'pixels'}`;
        });
    }

    /**
     * Bind the recording frequency range input and update its display.
     */
    bindRecordingFrequencyRange() {
        const rangeElement = this.settingsContainer.querySelector('#recording-frequency-range');
        const currentValueElement = this.settingsContainer.querySelector('#current-recording-frequency-range');

        rangeElement.addEventListener('input', function() {
            currentValueElement.textContent = `${rangeElement.value}ms`;
        });
    }

    /**
     * Bind the heatmap breakpoint select input and manage the breakpoint list.
     */
    bindHeatmapBreakpointSelect() {
        const selectElement = this.settingsContainer.querySelector('#heatmap-breakpoints-select');
        this.generateBreakpointList(selectElement.value);
        
        selectElement.addEventListener('change', () => {
            this.generateBreakpointList(selectElement.value);
        });

        const listContainer = this.settingsContainer.querySelector('#heatmap-breakpoints-list-container');
        const showListButton = this.settingsContainer.querySelector('#show-heatmap-breakpoints-list');
        showListButton.addEventListener('click', () => {
            listContainer.classList.toggle('hidden');
            showListButton.parentNode.classList.toggle('hidden');
        });
    }

    /**
     * Bind the recording strategy select input and update related information.
     */
    bindRecordingStrategySelect() {
        const selectElement = this.settingsContainer.querySelector('#recording-strategy-select');
        const infoElement = this.settingsContainer.querySelector('#recording-strategy-info');
        const exampleElement = this.settingsContainer.querySelector('#recording-strategy-example');

        selectElement.addEventListener('change', () => {
            switch (selectElement.value) {
                case "url":
                    infoElement.textContent = EasyHeatmap.EL.text("RECORDING_TRIGGER_OPTION_URL_EXPLANATION");
                    exampleElement.textContent = "example.com/about, example.com/contact";
                    break;
                case "url-query":
                    infoElement.textContent = EasyHeatmap.EL.text("RECORDING_TRIGGER_OPTION_URL_QUERY_EXPLANATION");
                    exampleElement.textContent = "example.com/about?location=sydney, example.com/about?location=melbourne, example.com/contact";
                    break;
                case "code":
                    infoElement.textContent = EasyHeatmap.EL.text("RECORDING_TRIGGER_OPTION_CODE_EXPLANATION");
                    exampleElement.textContent = "EasyHeatmap.start('home'), EasyHeatmap.start('home-sydney'), EasyHeatmap.start('contact')";
                    break;
                default:
                    infoElement.textContent = "";
            }
        });

        selectElement.dispatchEvent(new Event('change'));
    }

    /**
     * Generate the breakpoint list based on the selected preset.
     * @param {string} preset - The selected breakpoint preset.
     */
    generateBreakpointList(preset) {
        let breakpoints = [];
        switch (preset) {
            case "bootstrap":
                breakpoints = [
                    { name: "Extra Small", value: 0, disabled: true },
                    { name: "Small", value: 576, disabled: true },
                    { name: "Medium", value: 768, disabled: true },
                    { name: "Large", value: 992, disabled: true },
                    { name: "Extra Large", value: 1200, disabled: true },
                    { name: "XX Large", value: 1400, disabled: true }
                ];
                break;
            case "tailwind":
                breakpoints = [
                    { name: "Extra Small", value: 0, disabled: true },
                    { name: "Small", value: 640, disabled: true },
                    { name: "Medium", value: 768, disabled: true },
                    { name: "Large", value: 1024, disabled: true },
                    { name: "Extra Large", value: 1280, disabled: true },
                    { name: "XX Large", value: 1536, disabled: true }
                ];
                break;
            case "foundation":
                breakpoints = [
                    { name: "Small", value: 0, disabled: true },
                    { name: "Medium", value: 641, disabled: true },
                    { name: "Large", value: 1025, disabled: true },
                    { name: "Extra Large", value: 1201, disabled: true },
                    { name: "XX Large", value: 1441, disabled: true }
                ];
                break;
            default:
                breakpoints = [
                    { name: "Extra Small", value: 0, disabled: true, nameDisabled: false }
                ];
        }

        const listContainer = this.settingsContainer.querySelector('#heatmap-breakpoints-list');
        listContainer.innerHTML = '';
        for (const breakpoint of breakpoints) {
            listContainer.innerHTML += `
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <input type="text" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="${breakpoint.name}" ${breakpoint.disabled && (breakpoint.nameDisabled === undefined || breakpoint.nameDisabled) ? "disabled": ""}>
                    </th>
                    <td class="px-2 py-2">
                        <input type="number" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="${breakpoint.value}" ${breakpoint.disabled ? "disabled": ""}>
                    </td>
                    <td class="px-6 py-4 text-right">
                        ${
                            breakpoint.disabled ? 
                            `<span class="font-medium text-gray-600 dark:text-gray-500">Delete</span>` : 
                            `<a href="#" class="heatmap-delete-breakpoint font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>`
                        }
                    </td>
                </tr>
            `;
        }
        
        if (preset === "custom") {
            listContainer.innerHTML += `
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="px-2 py-2" colspan="3">
                        <button type="button" id="heatmap-add-breakpoint" class="w-full px-3 py-2 text-xs font-medium text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Add breakpoint</button>
                    </td>
                </tr>
            `;

            const addBreakpointButton = listContainer.querySelector('#heatmap-add-breakpoint');
            addBreakpointButton.addEventListener('click', () => {
                const newRow = document.createElement('tr');
                newRow.classList.add('bg-white', 'border-b', 'dark:bg-gray-800', 'dark:border-gray-700', 'hover:bg-gray-50', 'dark:hover:bg-gray-600');
                newRow.innerHTML = `
                    <th scope="row" class="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <input type="text" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="New Breakpoint">
                    </th>
                    <td class="px-2 py-2">
                        <input type="number" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="0">
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" class="heatmap-delete-breakpoint font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                    </td>
                `;
                
                const lastRow = listContainer.querySelector("tr:last-child");
                listContainer.insertBefore(newRow, lastRow);

                newRow.querySelector(".heatmap-delete-breakpoint").addEventListener('click', event => {
                    event.preventDefault();
                    const row = event.target.closest('tr');
                    row.remove();
                });
            });
        }
    }
}
