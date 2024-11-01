<?php
/*
  Plugin Name: WP Pixabay Search And Insert
  Plugin URI: https://wpclever.net
  Description: This plugin help you search millions of free photos, vectors and art illustrations from https://pixabay.com then insert into content or set as featured image very quickly.
  Version: 2.6
  Author: WPclever
  Author URI: https://wpclever.net/contact
 */
register_activation_hook( __FILE__, 'vpxb_activate' );
add_action( 'admin_init', 'vpxb_redirect' );
function vpxb_activate() {
	add_option( 'vpxb_do_activation_redirect', true );
}

function vpxb_redirect() {
	if ( get_option( 'vpxb_do_activation_redirect', false ) ) {
		delete_option( 'vpxb_do_activation_redirect' );
		wp_redirect( 'admin.php?page=vpxb' );
	}
}

add_action( 'admin_menu', 'vpxb_menu' );
function vpxb_menu() {
	add_menu_page( 'Pixabay', 'Pixabay', 'manage_options', 'vpxb', 'vpxb_menu_pages', 'dashicons-camera' );
}

function vpxb_menu_pages() {
	$vpxb_active_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : 'settings';
	?>
	<div class="wrap vpxb_welcome">
		<h1>Welcome to WP Pixabay Search And Insert</h1>

		<div class="about-text">
		This plugin moved to "WP Pixabay" ( <a href="https://wordpress.org/plugins/wp-pixabay/" target="_blank">https://wordpress.org/plugins/wp-pixabay/</a> ) with more performance functions. So, please uninstall this plugin then install "WP Pixabay".
		</div>
	</div>
	<?php
}

function vpxb_load_scripts() {
	if ( ( get_option( 'vpxb_username' ) != '' ) && ( get_option( 'vpxb_key' ) != '' ) ) {
		$vpxb_username = get_option( 'vpxb_username' );
		$vpxb_key      = get_option( 'vpxb_key' );
	} else {
		$vpxb_username = 'dunghv';
		$vpxb_key      = '1498928-f190b376157b831824bdfb89b';
	}
	wp_enqueue_script( 'colorbox', plugin_dir_url( __FILE__ ) . 'js/jquery.colorbox.js', array( 'jquery' ) );
	wp_enqueue_style( 'colorbox', plugin_dir_url( __FILE__ ) . 'css/colorbox.css' );
	wp_enqueue_style( 'vpxb_css', plugin_dir_url( __FILE__ ) . 'css/vpxb.css' );
	wp_enqueue_script( 'vpxb_js', plugin_dir_url( __FILE__ ) . 'js/vpxb.js', array( 'jquery' ), '1.0', true );
	wp_localize_script( 'vpxb_js', 'vpxb_vars', array(
		'vpxb_username' => $vpxb_username,
		'vpxb_key'      => $vpxb_key,
		'vpxb_ajax_url' => admin_url( 'admin-ajax.php' ),
		'vpxb_nonce'    => wp_create_nonce( 'vpxb_nonce' )
	) );
}

add_action( 'admin_enqueue_scripts', 'vpxb_load_scripts' );
if ( get_option( 'vpxb_frontend', 0 ) == 1 ) {
	add_action( 'wp_enqueue_scripts', 'vpxb_load_scripts' );
}
function vpxb_add_button( $editor_id ) {
	echo ' <a href="#vpxb_popup" id="vpxb_btn" data-editor="' . $editor_id . '" class="vpxb_btn button add_media" title="Pixabay"><span class="dashicons dashicons-camera vpxb_dashicons"></span> Pixabay</a><input type="hidden" id="vpxb_featured_url" name="vpxb_featured_url" value="" /> ';
}

add_action( 'media_buttons', 'vpxb_add_button' );

function vpxb_popup_content() {
	?>
	<div style='display:none'>
		<div id="vpxb_popup" style="width: 920px; height: 440px; position: relative; overflow: hidden">
			<table style="width: 100%; height: 100%; padding: 0; margin: 0; border-spacing: 0; vertical-align: top">
				<tr>
					<td style="width: 620px; vertical-align: top; padding: 10px">
						<div style="text-align: center; padding-top: 60px">
							This plugin moved to "WP Pixabay" ( <a href="https://wordpress.org/plugins/wp-pixabay/" target="_blank">https://wordpress.org/plugins/wp-pixabay/</a> ) with more performance functions. So, please uninstall this plugin then install "WP Pixabay".
						</div>
					</td>
					<td style="border-left: 1px solid #ddd; background: #fcfcfc; vertical-align: top; padding: 10px">
						<div style="text-align: center; padding-top: 60px">
							This plugin moved to "WP Pixabay" ( <a href="https://wordpress.org/plugins/wp-pixabay/" target="_blank">https://wordpress.org/plugins/wp-pixabay/</a> ) with more performance functions. So, please uninstall this plugin then install "WP Pixabay".
						</div>
					</td>
				</tr>
			</table>
		</div>
	</div>
	<?php
}

add_action( 'admin_footer', 'vpxb_popup_content' );
if ( get_option( 'vpxb_frontend', 0 ) == 1 ) {
	add_action( 'wp_footer', 'vpxb_popup_content', 100 );
}
?>