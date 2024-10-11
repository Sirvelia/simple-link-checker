<?php
namespace SimpleLinkChecker\Functionality;

use SimpleLinkChecker\Includes\BladeLoader;

class MetaBoxes
{

	protected $plugin_name;
	protected $plugin_version;

	protected $blade;

	public function __construct($plugin_name, $plugin_version)
	{
		$this->plugin_name = $plugin_name;
		$this->plugin_version = $plugin_version;

		$this->blade = BladeLoader::get_instance();

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
		// global $post;
		// $post_id = esc_attr($post->ID);
		echo $this->blade->template('outbound-links');

		// echo '<div id="simple-link-checker-app" data-post-id="'.$post_id.'"></div>';
	}
}
