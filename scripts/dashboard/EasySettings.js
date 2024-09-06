class EasySettings {
	constructor(dashboard) {
		this.dashboard = dashboard;
		this.settingsContainer = null;
		this.init();
	}

	init() {
		this.settingsContainer = this.dashboard.contentContainer.querySelector('#easy-settings-container');
		this.bindButtons();
	}

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
}