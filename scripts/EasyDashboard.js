class EasyDashboard {
	constructor(pluginBase, containerTag) {
		this.pluginBase = pluginBase;
		this.appContainer = document.querySelector(containerTag);
		this.contentContainer = this.appContainer.querySelector("#easy-dashboard-content");
		this.navigationContainer = this.appContainer.querySelector("#easy-dashboard-navigation");
		this.bindNavigation();

		this.settings = null;

		const params = this.getParams();
        if (params.p) {
            this.navigateTo(params.p);
        } else {
			this.navigateTo("settings");
		}
	}

	getParams() {
		const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
	}

	setParam(key, value) {
		const url = new URL(window.location);
		url.searchParams.set(key, value);
		history.pushState({}, '', url);
	}

	async bindNavigation() {
		const navigationItems = this.navigationContainer.querySelectorAll("a");
		navigationItems.forEach(item => {
			item.addEventListener("click", event => {
				const panel = item.getAttribute("data-panel");
				this.navigateTo(panel);
			});
		});
	}

	async navigateTo(panel) {
		this.contentContainer.innerHTML = `
			<div class="flex justify-center items-center h-full">
				<div role="status">
					<svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
			</div>
		`;
		switch(panel) {
			case "settings":
				this.contentContainer.innerHTML = await this.loadSettingsPanel();
				if (this.settings === null) {
					this.settings = new EasySettings(this);
				} else {
					this.settings.init();
				}
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
	}

	loadSettingsPanel() {
		return new Promise((resolve, reject) => {
			fetch(`${this.pluginBase}/panels/settings.php`)
			.then(response => response.text())
			.then(html => resolve(html))
			.catch(error => reject(error));
		});
	}

	loadDatabasePanel() {
		return new Promise((resolve, reject) => {
			fetch(`${this.pluginBase}/panels/database.php`)
			.then(response => response.text())
			.then(html => resolve(html))
			.catch(error => reject(error));
		});
	}

	loadStoragePanel() {
		return new Promise((resolve, reject) => {
			fetch(`${this.pluginBase}/panels/storage.php`)
			.then(response => response.text())
			.then(html => resolve(html))
			.catch(error => reject(error));
		});
	}

	loadHeatmapsPanel() {
		return new Promise((resolve, reject) => {
			fetch(`${this.pluginBase}/panels/heatmaps.php`)
			.then(response => response.text())
			.then(html => resolve(html))
			.catch(error => reject(error));
		});
	}

	loadRecordingsPanel() {
		return new Promise((resolve, reject) => {
			fetch(`${this.pluginBase}/panels/recordings.php`)
			.then(response => response.text())
			.then(html => resolve(html))
			.catch(error => reject(error));
		});
	}
}