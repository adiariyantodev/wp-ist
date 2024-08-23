<?php

namespace Elementor;

defined('ABSPATH') || exit;

class Ekit_Wb_865 extends Widget_Base {

	public function get_name() {
		return 'ekit_wb_865';
	}


	public function get_title() {
		return esc_html__( 'New Widget', 'elementskit-lite' );
	}


	public function get_categories() {
		return ['basic'];
	}


	public function get_icon() {
		return 'eicon-cog';
	}


	protected function register_controls() {

		$this->start_controls_section(
			'advance_section_865_0',
			array(
				'label' => esc_html__( 'Title', 'elementskit-lite' ),
				'tab'   => Controls_Manager::TAB_ADVANCED,
			)
		);

		$this->add_control(
			'ekit_wb_865_entrance_animation',
			array(
				'label' => esc_html__( 'Entrance Animation', 'elementskit-lite' ),
				'type'  => Controls_Manager::ANIMATION,
				'show_label' => true,
				'label_block' => true,
				'prefix_class' => 'animated ',
			)
		);

		$this->end_controls_section();

	}


	protected function render() {
		$settings = $this->get_settings_for_display();

		?>
<?php echo isset($settings["ekit_wb_865_exit_animation"]) ? $settings["ekit_wb_865_exit_animation"] : ""; ?>
		<?php
	}


}
