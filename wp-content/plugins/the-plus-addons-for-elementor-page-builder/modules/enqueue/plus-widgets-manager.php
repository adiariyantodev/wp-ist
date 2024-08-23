<?php
if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly

Class Plus_Widgets_Manager {
	/**
	 * A reference to an instance of this class.
	 *
	 * @since 1.0.0
	 * @var   object
	 */	
	private static $instance = null;
	
	public $transient_widgets = [];
	public $preload_name = '';
	public $post_type = '';
	public $post_id = '';

	/**
	 * Returns the instance.
	 * @since  1.0.0
	 */
	public static function get_instance( $shortcodes = array() ) {
		
		if ( null == self::$instance ) {
			self::$instance = new self( $shortcodes );
		}
		return self::$instance;
	}
	
	/**
	 * Constructor
	 */
	public function __construct( $post_id = '', $post_type = '' ) {
		if( !empty($post_id) ){
			$this->post_type = $post_type;
			$this->post_id = intval( $post_id );
			$this->get_widgets_list( $this->post_id, $this->post_type );
		}
	}

	/**
	 * get_element_list
	 * get cached widget list
	 * @param $post_id
	 *
	 * @return bool
	 */
	public function get_widgets_list( $post_id = '', $post_type = '' ) {

		if ( is_object( Elementor\Plugin::instance()->editor ) && Elementor\Plugin::instance()->editor->is_edit_mode() ) {
			return false;
		}

		$document	= is_object( Elementor\Plugin::$instance->documents ) ? Elementor\Plugin::$instance->documents->get( $post_id ) : [];
		$data = is_object( $document ) ? $document->get_elements_data() : [];
		
		$data	= $this->get_widget_list( $data );

		$this->preload_name = $post_id;
		//current page/post load all templates one time load elements
		if( isset($this->transient_widgets) && !empty($this->transient_widgets)){
			if(isset(l_theplus_generator()->post_assets_objects['elements'])){
				$elements = l_theplus_generator()->post_assets_objects['elements'];
			}else{
				$elements = [];
			}
			$different_elements = array_diff($this->transient_widgets, $elements);
			if($this->transient_widgets != $different_elements){
				$this->preload_name = get_queried_object_id().'-'.$post_id;
			}
			l_theplus_generator()->post_assets_objects['elements'] = array_unique(array_merge($elements, $this->transient_widgets ) );
			$this->transient_widgets = $different_elements;
		}

		if(!empty($this->transient_widgets)){
			l_theplus_library()->remove_files_unlink($post_type, $this->preload_name, ['css'], true);

			//regenerate files page/post
			if ( !l_theplus_generator()->check_css_js_cache_files( $post_type, $this->preload_name, 'css', true ) && l_theplus_generator()->get_caching_option() == false ) {
				sort($this->transient_widgets);
				l_theplus_generator()->plus_generate_scripts( $this->transient_widgets, 'theplus-preload-' . $post_type . '-' . $this->preload_name, ['css'], false);
			}
		}

		return true;
	}

	public function tpebl_layout_listing($options)  {

		$layout = !empty($options["layout"]) ? $options["layout"] : 'grid';
    
		if($layout == 'grid' || $layout == 'masonry'){
			return 'plus-listing-masonry';
		}else if($layout == 'metro'){
			return 'plus-listing-metro';
		}
	}

	/**
	 * get_widget_list
	 * get widget names
	 * @param array $data
	 *
	 * @return array
	 */
	public function get_widget_list( $data ) {
		$widget_list = [];
		$replace = [
			'tp_smooth_scroll' => 'tp-smooth-scroll',
		];

		if ( is_object( Elementor\Plugin::$instance->db ) ) {
			Elementor\Plugin::$instance->db->iterate_data( $data, function ( $element ) use ( &$widget_list, $replace ) {

				if ( empty( $element['widgetType'] ) ) {
					$type = $element['elType'];
				} else {
					$type = $element['widgetType'];
				}
				
				if ( ! empty( $element['widgetType'] ) && $element['widgetType'] === 'global' ) {
					$document = Elementor\Plugin::$instance->documents->get( $element['templateID'] );
					$type     = is_object( $document ) ? current( $this->get_widget_list( $document->get_elements_data() ) ) : $type;

					if ( ! empty( $type ) ) {
						$type = 'tp-' . $type;
					}
				}
				
				if ( ! empty( $type ) && ! is_array( $type ) ) {

					if ( isset( $replace[ $type ] ) ) {
						$type = $replace[ $type ];
					}
					
					if ( ! in_array( $type, $this->transient_widgets) ) {
						$this->transient_widgets[] = $type;
					}

					if(isset($element['widgetType'])){
						$this->plus_widgets_options( $element['settings'], $element['widgetType']);
					}else if(isset($element['elType'])){
						$this->plus_widgets_options( $element['settings'], $element['elType']);
					}

				}

			} );
		}
		return $this->transient_widgets;
	}

	/**
	* Check Widgets Options
	* @since 2.0.2
	*/
	public function plus_widgets_options($options='',$widget_name=''){
		if(!empty($options["seh_switch"]) && $options["seh_switch"]=='yes'){
			$this->transient_widgets[] = 'plus-equal-height';
		}
		if(tp_has_lazyload() && !in_array( 'plus-lazyLoad', $this->transient_widgets)){
			$this->transient_widgets[] = 'plus-lazyLoad';
		}

		if(!empty($options["animation_effects"]) && $options["animation_effects"]!='no-animation'){
			$this->transient_widgets[] = 'plus-velocity';
		}
		
		if(!empty($options["loop_display_button"]) && $options["loop_display_button"]=='yes'){
			$this->transient_widgets[] = 'plus-button-extra';
		}
		
		if(!empty($widget_name) && $widget_name=='tp-button' && !empty($options["btn_hover_effects"])){
			$this->transient_widgets[] = 'plus-content-hover-effect';
		}
		
		if(!empty($widget_name) && $widget_name=='tp-blog-listout'){
			$this->transient_widgets[] = $this->tpebl_layout_listing($options);
		}
		
		if(!empty($widget_name) && $widget_name=='tp-clients-listout'){
			$this->transient_widgets[] = $this->tpebl_layout_listing($options); 
		}

		if(!empty($widget_name) && $widget_name=='tp-gallery-listout'){			
			$this->transient_widgets[] = $this->tpebl_layout_listing($options); 
		}
		if(!empty($widget_name) && $widget_name=='tp-team-member-listout'){			
			$this->transient_widgets[] = $this->tpebl_layout_listing($options); 
		}
		if(!empty($widget_name) && $widget_name=='tp-testimonial-listout'){			
			$this->transient_widgets[] = $this->tpebl_layout_listing($options); 
		}

		if((!empty($widget_name) && $widget_name=='tp-flip-box') || (!empty($widget_name) && $widget_name=='tp-info-box')){

			$image_icon = !empty($options["image_icon"]) ? $options["image_icon"] : 'icon';
			
			if(!empty($options["display_button"]) && $options["display_button"]=='yes'){
				$this->transient_widgets[] = 'plus-button-extra';
			}			
			if(!empty($options["box_hover_effects"])){
				$this->transient_widgets[] = 'plus-content-hover-effect';
			}			
			if($image_icon =='svg' || !empty($options["loop_select_icon"]) && $options["loop_select_icon"]=='svg'){
				$this->transient_widgets[] = 'tp-draw-svg';
			}
		}
		
		if(!empty($options["box_hover_effects"]) && !empty($widget_name) && $widget_name=='tp-number-counter'){
			$this->transient_widgets[] = 'plus-content-hover-effect';
		}
		
		if(!empty($widget_name) && $widget_name=='tp-page-scroll'){
			if(!isset($options["page_scroll_opt"]) || (!empty($options["page_scroll_opt"]) && $options["page_scroll_opt"]=='tp_full_page')){
				$this->transient_widgets[] = 'tp-fullpage';
			}
		}

		if(has_filter('tp_has_widgets_condition')) {
			$this->transient_widgets = apply_filters('tp_has_widgets_condition', $this->transient_widgets, $options, $widget_name );
		}
	}
}

/**
 * Returns instance of Plus_Widgets_Manager
 */	
Plus_Widgets_Manager::get_instance();

/**
 * Get post assets object.
 *
 * @since new_version
 */
function tpae_get_post_assets( $post_id = '', $post_type = '' ) {
 	if ( ! isset( l_theplus_generator()->post_assets_objects[ $post_id ] ) ) {
		$post_obj = new Plus_Widgets_Manager( $post_id, $post_type );
		l_theplus_generator()->post_assets_objects[ $post_id ] = $post_obj;
	}
	return l_theplus_generator()->post_assets_objects[ $post_id ];
}