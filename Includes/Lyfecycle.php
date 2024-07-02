<?php

namespace SimpleLinkChecker\Includes;

class Lyfecycle
{
    public static function activate($network_wide)
    {
        do_action('SimpleLinkChecker/setup', $network_wide);
    }

    public static function deactivate($network_wide)
    {
        do_action('SimpleLinkChecker/deactivation', $network_wide);
    }

    public static function uninstall()
    {
        do_action('SimpleLinkChecker/cleanup');
    }
}
