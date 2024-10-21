<?php

namespace SimpleLinkChecker\Includes;

use eftec\bladeone\BladeOne;

class BladeLoader
{
    private static $instance = null;
    private $blade;

    private function __construct()
    {
        $this->blade = new BladeOne(
            SIMPLELINKCHECKER_PATH . 'resources/views',
            SIMPLELINKCHECKER_PATH . 'resources/cache'
        );
    }

    // Clone not allowed
    private function __clone() {}

    public static function get_instance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new BladeLoader();
        }
        return self::$instance;
    }

    public function template($name, $args = [])
    {
        return $this->blade->run($name, $args);
    }
}
