<?php
/**
 * Class EasyLoc
 *
 * A class for handling localization in an application.
 *
 * This class handles loading localization strings from a PHP file based on the current language.
 * It can retrieve localization strings by key and output them directly.
 */
class EasyLoc {
    /**
     * The PDO instance for database access.
     *
     * @var PDO
     */
    private $pdo;

    /**
     * The prefix for database tables.
     *
     * @var string
     */
    private $prefix;

    /**
     * The current language code.
     *
     * @var string
     */
    public $language;

    /**
     * The array of localization strings.
     *
     * @var array
     */
    private $localisations;

    /**
     * EasyLoc constructor.
     *
     * Initializes the localization system by setting up the database connection,
     * sanitizing the table prefix, and loading the current language and its localizations.
     *
     * @param PDO    $pdo    The PDO instance for database access.
     * @param string $prefix The prefix for database tables. Default is 'ehm_'.
     */
    public function __construct(PDO $pdo, $prefix = 'ehm_') {
        $this->pdo = $pdo;
        $this->prefix = preg_replace('/[^a-zA-Z0-9_]/', '', $prefix);

        $this->getLanguage();
        $this->loadLanguage();
    }

    /**
     * Retrieves the current language from the database.
     *
     * @return string The current language code.
     */
    public function getLanguage() {
        $query = $this->pdo->prepare("SELECT value FROM {$this->prefix}settings WHERE key = 'language'");
        $query->execute();
        $this->language = $query->fetchColumn();
        return $this->language;
    }

    /**
     * Gets the localisations array or its JSON representation.
     *
     * @param bool $json If true, returns the localisations as a JSON string. Default is false.
     *
     * @return array|string The localisations array or JSON string.
     */
    public function getLocalisation($json = false) {
        return $json ? json_encode($this->localisations) : $this->localisations;
    }

    /**
     * Loads the localization strings for the current language.
     *
     * @return void
     */
    private function loadLanguage() {
        $this->localisations = include "/var/www/test/dashboard/localisations/{$this->language}.php";
    }

    /**
     * Retrieves a localization string by its key.
     *
     * @param string $key The key of the localization string.
     *
     * @return string The localization string if found, otherwise returns the key.
     */
    public function text($key) {
        return $this->localisations[$key] ?? $key;
    }

    /**
     * Outputs a localization string by its key.
     *
     * @param string $key The key of the localization string.
     *
     * @return void
     */
    public function echo($key) {
        echo $this->localisations[$key] ?? $key;
    }
}
