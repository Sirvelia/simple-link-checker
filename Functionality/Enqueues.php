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

		$asset_file = include SIMPLELINKCHECKER_PATH . 'build/index.asset.php';

		foreach ($asset_file['dependencies'] as $style) {
			wp_enqueue_style($style);
		}

		wp_register_script(
			$this->plugin_name,
			SIMPLELINKCHECKER_URL . 'build/index.js',
			$asset_file['dependencies'],
			$asset_file['version']
		);
		wp_enqueue_script($this->plugin_name);

	}
}
