<?php

namespace SimpleLinkChecker\Includes;

class Loader
{
    public function __construct()
    {
        $this->loadDependencies();

        add_action('plugins_loaded', [$this, 'loadPluginTextdomain']);
    }

    private function loadDependencies()
    {
        //FUNCTIONALITY CLASSES
        foreach (glob(SIMPLELINKCHECKER_PATH . 'Functionality/*.php') as $filename) {
            $class_name = '\\SimpleLinkChecker\Functionality\\' . basename($filename, '.php');
            if (class_exists($class_name)) {
                try {
                    new $class_name(SIMPLELINKCHECKER_NAME, SIMPLELINKCHECKER_VERSION);
                } catch (\Throwable $e) {
                    error_log(print_r($e, true));
                    continue;
                }
            }
        }

        //ADMIN FUNCTIONALITY
        if( is_admin() ) {
            foreach (glob(SIMPLELINKCHECKER_PATH . 'Functionality/Admin/*.php') as $filename) {
                $class_name = '\\SimpleLinkChecker\Functionality\Admin\\' . basename($filename, '.php');
                if (class_exists($class_name)) {
                    try {
                        new $class_name(SIMPLELINKCHECKER_NAME, SIMPLELINKCHECKER_VERSION);
                    } catch (\Throwable $e) {
                        error_log(print_r($e, true));
                        continue;
                    }
                }
            }
        }
    }

    public function loadPluginTextdomain()
    {
        load_plugin_textdomain('simple-link-checker', false, dirname(SIMPLELINKCHECKER_BASENAME) . '/languages/');
    }
}
