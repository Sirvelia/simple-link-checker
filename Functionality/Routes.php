<?php
namespace SimpleLinkChecker\Functionality;

use PluboRoutes\Endpoint\GetEndpoint;


class Routes
{
    protected $plugin_name;
	protected $plugin_version;

	public function __construct($plugin_name, $plugin_version)
	{
		$this->plugin_name = $plugin_name;
		$this->plugin_version = $plugin_version;

		add_action('after_setup_theme', [$this, 'load_plubo_routes']);
		add_filter('plubo/endpoints', [$this, 'add_endpoints']);
	}

	public function load_plubo_routes($routes)
	{
		\PluboRoutes\RoutesProcessor::init();
	}

	public function add_endpoints($routes)
	{
		
        $routes[] = new GetEndpoint(
            'simple-link-checker/v1',
            'check-link',
            [$this, 'check_link'],
            function() {
                return current_user_can('edit_posts');
            }
        );

		return $routes;
	}

    public function check_link($request)
    {
        $url = $request->get_param('url');
        $response = wp_remote_head($url);
        
        if (is_wp_error($response)) {
            return new WP_Error('link_check_failed', $response->get_error_message(), array('status' => 500));
        }
        
        return array(
            'status' => wp_remote_retrieve_response_code($response)
        );
    }

}