<?php

/**
 * @wordpress-plugin
 * Plugin Name:       Simple Link Checker
 * Description:       Manage inbound and outbound post links.
 * Version:           2.1.0
 * Author:            Sirvelia
 * Author URI:        https://sirvelia.com/
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       simple-link-checker
 * Domain Path:       /languages
 * Requires Plugins:
 */

if (!defined('WPINC')) {
    die('YOU SHALL NOT PASS!');
}

// PLUGIN CONSTANTS
define('SIMPLELINKCHECKER_NAME', 'simple-link-checker');
define('SIMPLELINKCHECKER_VERSION', '2.1.0');
define('SIMPLELINKCHECKER_PATH', plugin_dir_path(__FILE__));
define('SIMPLELINKCHECKER_BASENAME', plugin_basename(__FILE__));
define('SIMPLELINKCHECKER_URL', plugin_dir_url(__FILE__));
define('SIMPLELINKCHECKER_ASSETS_PATH', SIMPLELINKCHECKER_PATH . 'dist/' );
define('SIMPLELINKCHECKER_ASSETS_URL', SIMPLELINKCHECKER_URL . 'dist/' );

// AUTOLOAD
if (file_exists(SIMPLELINKCHECKER_PATH . 'vendor/autoload.php')) {
    require_once SIMPLELINKCHECKER_PATH . 'vendor/autoload.php';
}

// LYFECYCLE
register_activation_hook(__FILE__, [SimpleLinkChecker\Includes\Lyfecycle::class, 'activate']);
register_deactivation_hook(__FILE__, [SimpleLinkChecker\Includes\Lyfecycle::class, 'deactivate']);
register_uninstall_hook(__FILE__, [SimpleLinkChecker\Includes\Lyfecycle::class, 'uninstall']);

// LOAD ALL FILES
$loader = new SimpleLinkChecker\Includes\Loader();
