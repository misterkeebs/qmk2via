#include QMK_KEYBOARD_H

// Layer shorthand
enum layers {
    _BASE = 0, // Base
    _EXTR,     // Extra
    _CTRL      // Control
};

#define KC_CTAB MT(MOD_LCTL, KC_TAB)  // Control held, Tab pressed
#define KC_EXSP LT(_EXTR, KC_SPC)     // Extras layer held, Space pressed
#define KC_CTSL LT(_CTRL, KC_SLSH)    // Control layer held, Slash pressed
#define RGB_MSW RGB_M_SW              // Changes to Swirl underglow mode

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
	[_BASE] = LAYOUT_split_space(
		KC_GESC, KC_Q, KC_W, KC_E, KC_R, KC_T, KC_Y, KC_U, KC_I, KC_O, KC_P, KC_BSPC,
		KC_CTAB, KC_A, KC_S, KC_D, KC_F, KC_G, KC_H, KC_J, KC_K, KC_L, KC_ENT,
		KC_LSFT, KC_Z, KC_X, KC_C, KC_V, KC_B, KC_N, KC_M, KC_COMM, KC_DOT, KC_CTSL,
		KC_LCTL, KC_LALT, KC_LGUI, KC_EXSP, KC_SPC, KC_RGUI, KC_RALT, KC_RCTL),

	[_EXTR] = LAYOUT_split_space(
    KC_GRV , KC_1   , KC_2   , KC_3   , KC_4   , KC_5   , KC_6   , KC_7   , KC_8   , KC_9   , KC_0   , _______, \
    _______, _______, KC_MINS, KC_EQL , _______, _______, KC_EQL , KC_MINS, KC_SCLN, KC_QUOT, _______,          \
    _______, _______, _______, _______, _______, _______, _______, _______, KC_LBRC, KC_RBRC, KC_BSLS,          \
		_______, _______, _______, _______, _______, _______, _______, _______),

	[_CTRL] = LAYOUT_split_space(
    RESET,   RGB_TOG, RGB_MOD, RGB_HUI, RGB_HUD, RGB_SAI, RGB_SAD, RGB_VAI, RGB_VAD, KC_UP  , _______, KC_DEL , \
    _______, KC_MUTE, KC_VOLD, KC_VOLU, _______, _______, _______, _______, KC_LEFT, KC_RGHT, _______,          \
    _______, KC_PSCR, KC_LSCR, _______, _______, _______, _______, _______, KC_DOWN, _______, _______,          \
		_______, _______, _______, _______, _______, _______, _______, _______),

};
