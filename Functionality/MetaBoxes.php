<?php
namespace SimpleLinkChecker\Functionality;

class MetaBoxes
{

	protected $plugin_name;
	protected $plugin_version;

	public function __construct($plugin_name, $plugin_version)
	{
		$this->plugin_name = $plugin_name;
		$this->plugin_version = $plugin_version;

		add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
	}

	public function add_meta_boxes()
	{

		add_meta_box(
			$this->plugin_name,
			esc_html__('Simple Link Checker', 'simple-link-checker'),
			[$this, 'render'],
		);

	}

	public function render()
	{
		echo '<div id="simple-link-checker-app"></div>';
	}
}
