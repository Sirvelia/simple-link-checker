<?php
namespace SimpleLinkChecker\Functionality;

use PluboRoutes\Endpoint\GetEndpoint;


class ApiEndpoints
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

        $routes[] = new GetEndpoint(
            'simple-link-checker/v1',
            'inbound-links',
            [$this, 'inbound_links'],
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
            return array(
                'status' => 500
            );
        }
        
        return array(
            'status' => wp_remote_retrieve_response_code($response)
        );
    }

    public function inbound_links($request)
    {
        $post_id = $request->get_param('post_id');

        if (!$post_id) {
            return false;
        }

        global $wpdb;

        $inbound_links = $wpdb->get_results($wpdb->prepare(
            "SELECT DISTINCT ID, post_title, post_type
            FROM {$wpdb->posts}
            WHERE post_content LIKE %s
            AND post_status = 'publish'
            AND ID != %d",
            '%' . $wpdb->esc_like(get_permalink($post_id)) . '%',
            $post_id
        ));

        return $inbound_links;

    }

}