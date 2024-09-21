/**
 * Class representing localization functionality.
 */
class EasyLoc {
    /**
     * Create an EasyLoc instance.
     * @param {string} language - The current language code.
     * @param {Object} localisations - An object containing localization strings.
     */
    constructor(language, localisations) {
        this.language = language;
        this.localisations = localisations;
    }

    /**
     * Retrieve a localization string by key.
     * @param {string} key - The key for the localization string.
     * @returns {string} The localized string if found; otherwise, returns the key itself.
     */
    text(key) {
        return this.localisations[key] ?? key;
    }
}
