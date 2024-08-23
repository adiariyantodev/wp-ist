<?php
/*
Plugin Name: UiPress Pro
Plugin URI: https://uipress.co
Description: UiPress is an all in one solution for tailoring your WordPress admin interactions. UiPress pro expands the uipress lite plugins with new blocks and extra features
Version: 3.2.20
Author: Admin 2020
Text Domain: uipress-pro
Domain Path: /languages/
*/

// If this file is called directly, abort.
!defined('ABSPATH') ? exit() : '';

define('uip_pro_plugin_version', '3.2.20');
define('uip_pro_plugin_name', 'UiPress Pro');
define('uip_pro_plugin_path_name', 'uipress-pro');
define('uip_pro_plugin_url', plugin_dir_url(__FILE__));
define('uip_pro_plugin_path', plugin_dir_path(__FILE__));

require uip_pro_plugin_path . 'admin/uipress-pro-compiler.php';

$uipress = new uipress_pro_compiler();
$uipress->run();
