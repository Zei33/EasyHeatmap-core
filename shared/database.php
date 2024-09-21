<?php
require_once("environment.php");

/**
 * Class Database
 *
 * A class for handling database connections using PDO.
 *
 * This class establishes a connection to a MySQL database using credentials provided in the environment configuration.
 */
class Database {
    /**
     * The PDO instance for database access.
     *
     * @var PDO
     */
    private $pdo;

    /**
     * Database constructor.
     *
     * Initializes the database connection using environment variables.
     *
     * @param object $env An object containing environment variables for the database connection.
     */
    public function __construct($env) {
        $this->connect($env);
    }

    /**
     * Establishes a connection to the database.
     *
     * @param object $env An object containing environment variables for the database connection.
     *
     * @return void
     */
    private function connect($env) {
        try {
            // Data Source Name (DSN) for the PDO connection
            $dsn = "mysql:host={$env->dbHost};port={$env->dbPort};dbname={$env->dbName};charset=utf8mb4";
            // Create a new PDO instance
            $this->pdo = new PDO($dsn, $env->dbUsername, $env->dbPassword);
            // Set the PDO error mode to exception
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // Terminate the script if the connection fails
            die("Connection failed: " . $e->getMessage());
        }
    }

    /**
     * Returns the PDO connection instance.
     *
     * @return PDO The PDO instance.
     */
    public function connection() {
        return $this->pdo;
    }
}

// Create a new Database instance using environment variables
$database = new Database($env);
$pdo = $database->connection();