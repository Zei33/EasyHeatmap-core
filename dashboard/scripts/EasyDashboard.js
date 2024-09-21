/**
 * Class representing the EasyDashboard.
 */
class EasyDashboard {
    /**
     * Create an EasyDashboard instance.
     * @param {string} pluginBase - The base URL of the plugin.
     * @param {string} containerTag - The CSS selector for the dashboard container element.
     */
    constructor(pluginBase, containerTag) {
        this.pluginBase = pluginBase;
        this.appContainer = document.querySelector(containerTag);
        this.contentContainer = this.appContainer.querySelector("#easy-dashboard-content");
        this.navigationContainer = this.appContainer.querySelector("#easy-dashboard-navigation");
		this.loaderContainer = this.appContainer.querySelector("#easy-dashboard-loader");
        this.bindNavigation();

        this.settings = null;
    }

    /**
     * Retrieve URL parameters as an object.
     * @returns {Object} An object containing the URL parameters.
     */
    getParams() {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    }

    /**
     * Set a URL parameter and update the browser's history state.
     * @param {string} key - The parameter key to set.
     * @param {string} value - The value to assign to the parameter key.
     */
    setParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        history.pushState({}, '', url);
    }

    /**
     * Bind click events to navigation items.
     */
    async bindNavigation() {
        const navigationItems = this.navigationContainer.querySelectorAll("a");
        navigationItems.forEach(item => {
            item.addEventListener("click", event => {
                const panel = item.getAttribute("data-panel");
                this.navigateTo(panel);
            });
        });
    }

    /**
     * Navigate to the specified panel and load its content.
     * @param {string} panel - The name of the panel to navigate to.
     */
    async navigateTo(panel) {
        // Display loading spinner
		this.loaderContainer.classList.remove("hidden");
        this.contentContainer.classList.add("hidden");

        switch(panel) {
            case "settings":
                this.contentContainer.innerHTML = await this.loadSettingsPanel();
                EasyHeatmap.settings.init();
                this.setParam("p", "settings");
                break;
            case "database":
                this.contentContainer.innerHTML = await this.loadDatabasePanel();
                this.setParam("p", "database");
                break;
            case "storage":
                this.contentContainer.innerHTML = await this.loadStoragePanel();
                this.setParam("p", "storage");
                break;
            case "heatmaps":
                this.contentContainer.innerHTML = await this.loadHeatmapsPanel();
                this.setParam("p", "heatmaps");
                break;
            case "recordings":
                this.contentContainer.innerHTML = await this.loadRecordingsPanel();
                this.setParam("p", "recordings");
                break;
            default:
                // Display "Panel not found" message
                this.contentContainer.innerHTML = `
                    <div class="flex justify-center items-center h-full">
                        <div class="text-center">
                            <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Panel not found</h1>
                            <p class="text-gray-600 dark:text-gray-400">The panel you are trying to access does not exist.</p>
                        </div>
                    </div>
                `;
                break;
        }

		this.loaderContainer.classList.add("hidden");
        this.contentContainer.classList.remove("hidden");
    }

	initialNavigation() {
		const params = this.getParams();
        if (params.p) {
            this.navigateTo(params.p);
        } else {
            this.navigateTo("settings");
        }
	}

    /**
     * Load the settings panel content.
     * @returns {Promise<string>} A promise that resolves to the HTML content of the settings panel.
     */
    loadSettingsPanel() {
        return new Promise((resolve, reject) => {
            fetch(`${this.pluginBase}/panels/settings.php`)
                .then(response => response.text())
                .then(html => resolve(html))
                .catch(error => reject(error));
        });
    }

    /**
     * Load the database panel content.
     * @returns {Promise<string>} A promise that resolves to the HTML content of the database panel.
     */
    loadDatabasePanel() {
        return new Promise((resolve, reject) => {
            fetch(`${this.pluginBase}/panels/database.php`)
                .then(response => response.text())
                .then(html => resolve(html))
                .catch(error => reject(error));
        });
    }

    /**
     * Load the storage panel content.
     * @returns {Promise<string>} A promise that resolves to the HTML content of the storage panel.
     */
    loadStoragePanel() {
        return new Promise((resolve, reject) => {
            fetch(`${this.pluginBase}/panels/storage.php`)
                .then(response => response.text())
                .then(html => resolve(html))
                .catch(error => reject(error));
        });
    }

    /**
     * Load the heatmaps panel content.
     * @returns {Promise<string>} A promise that resolves to the HTML content of the heatmaps panel.
     */
    loadHeatmapsPanel() {
        return new Promise((resolve, reject) => {
            fetch(`${this.pluginBase}/panels/heatmaps.php`)
                .then(response => response.text())
                .then(html => resolve(html))
                .catch(error => reject(error));
        });
    }

    /**
     * Load the recordings panel content.
     * @returns {Promise<string>} A promise that resolves to the HTML content of the recordings panel.
     */
    loadRecordingsPanel() {
        return new Promise((resolve, reject) => {
            fetch(`${this.pluginBase}/panels/recordings.php`)
                .then(response => response.text())
                .then(html => resolve(html))
                .catch(error => reject(error));
        });
    }
}
