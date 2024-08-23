<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'istid_istlive' );

/** Database username */
define( 'DB_USER', 'istid_istwp' );

/** Database password */
define( 'DB_PASSWORD', 'istCONN@124#' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'g1wy1fb2iwdncm3cwa1lmujdjtiutddewccwgjooibuas2zowzfkg6yaiovx1tqe' );
define( 'SECURE_AUTH_KEY',  'ywpzz3bzn48901rjs4jccmf8n0j7imryzlefxzjahg9jih6zftok0gd8idwo8xsj' );
define( 'LOGGED_IN_KEY',    'yueddywqqnze91uiffghhcdcgt6ilqjjtzqskmkrhwcr8dewaqvqgptijjhuwkpk' );
define( 'NONCE_KEY',        '4dvywxpidgegqrdiumoyc8wcvn7keffk7nusbveyynkg6nwvqigg5ijsmo3vpfev' );
define( 'AUTH_SALT',        'ahlhcyi2rscraco9wvt8bm8o9kojnbupbk8apwcucblaawx27mei5gvv1kmz61lc' );
define( 'SECURE_AUTH_SALT', 'wwgfmh31uxj8rlmek5eycdpgoel5w0c4kzhnuqftntge3hosssaqpfjbzyad5voe' );
define( 'LOGGED_IN_SALT',   'cvsa6zlaestezq10krkbromdblysgg7rmlbvt1fakutriqeblmjiuszrzgvitoul' );
define( 'NONCE_SALT',       's0n0efzoix5eudgvdknb8tjjegs1cclnggar3tij90ag84jslaey5rt8hz31azk8' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wpj1_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
