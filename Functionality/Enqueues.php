<?php
namespace SimpleLinkChecker\Functionality;

class Enqueues
{

	protected $plugin_name;
	protected $plugin_version;

	public function __construct($plugin_name, $plugin_version)
	{
		$this->plugin_name = $plugin_name;
		$this->plugin_version = $plugin_version;

		add_action('admin_enqueue_scripts', [$this, 'admin_enqueues']);
	}

	public function admin_enqueues()
	{

		/**
		 * Scripts
		 */

		$scripts_asset = include SIMPLELINKCHECKER_PATH . 'build/scripts/app.asset.php';

		foreach ($scripts_asset['dependencies'] as $script) {
			wp_enqueue_script($script);
		}

		wp_register_script(
			$this->plugin_name,
			SIMPLELINKCHECKER_URL . 'build/scripts/app.js',
			array('wp-api-fetch', 'wp-blocks'),
			$scripts_asset['version']
		);

		wp_localize_script($this->plugin_name, 'simpleLinkChecker', array(
			'apiUrl' => get_rest_url(),
			'postID' => get_the_ID(),
			'adminUrl' => get_admin_url(),
		));

		wp_enqueue_script($this->plugin_name);

		/**
		 * Styles
		 */

		$styles_asset = include SIMPLELINKCHECKER_PATH . 'build/styles/app.asset.php';

		foreach ($styles_asset['dependencies'] as $style) {
			wp_enqueue_style($style);
		}

		wp_enqueue_style(
			$this->plugin_name,
			SIMPLELINKCHECKER_URL . 'build/styles/app.css',
			array(),
			$styles_asset['version']
		);


	}
}
