class NavigationCard extends HTMLElement {
    set hass(hass) {
        const _this = this;
        var xDown, yDown, xDiff, yDiff;
        var is_swipe = false;
        var is_two_finger_touch = false;

        //Initialize the Card if it's not there yet
        if (!this.card) {
            initializeCard();
        }

        if(this.config.background_cover_art) {
            setBackgroundCoverArt();
        }
        
        
        function initializeCard() {
            //TODO: allow icon alignment in grid cell per button?
            //CSS
            const style = document.createElement('style');
            style.textContent = `
                    ha-card { height: 100%;}
                    .nc-touchpad {
                        padding: 5px;
                        height: 100%;
                        width: 100%;
                        box-sizing: border-box;
                        display: grid;
                        align-items: center;
                        justify-items: center;
                        gap: 10%;
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                        grid-template-rows: repeat(5, minmax(0, 1fr));
                        grid-template-areas: ' .  tbl tbm tbr  . ' 
                                             'lbt  .   .   .  rbt' 
                                             'lbm  .   .   .  rbm'
                                             'lbb  .   .   .  rbb'
                                             ' .  bbl bbm bbr  . '
                    }
                    .nc-button { position: relative; border-radius: 50%; }
                    .nc-button-icon {
                        cursor: pointer;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        align-content: center;
                        height: fit-content;
                        width: fit-content;
                        padding: 10%;
                    }
                    #top_button_left { grid-area: tbl;}
                    #top_button_middle { grid-area: tbm; }
                    #top_button_right { grid-area: tbr;  }
                    #left_button_top { grid-area: lbt; }
                    #left_button_middle { grid-area: lbm; }
                    #left_button_bottom { grid-area: lbb; }
                    #right_button_top { grid-area: rbt; }
                    #right_button_middle { grid-area: rbm; }
                    #right_button_bottom { grid-area: rbb; }
                    #bottom_button_left { grid-area: bbl; }
                    #bottom_button_middle { grid-area: bbm; }
                    #bottom_button_right { grid-area: bbr; }
                `;
            _this.appendChild(style);
            
            //HA Card
            const card = document.createElement('ha-card');
            _this.card = card;
            _this.appendChild(card);        
    
            //Build Touchpad
            let touchpad = document.createElement('div');
            touchpad.id = 'touchpad';
            touchpad.className = 'nc-touchpad';
            card.appendChild(touchpad);
            
            let buttons = [];
            //Top Buttons
            buildAndAppendButton('top_button_left', _this.config?.button_actions?.top_button_left); 
            buildAndAppendButton('top_button_middle', _this.config?.button_actions?.top_button_middle); 
            buildAndAppendButton('top_button_right', _this.config?.button_actions?.top_button_right); 
            
            //Bottom Buttons
            buildAndAppendButton('bottom_button_left', _this.config?.button_actions?.bottom_button_left); 
            buildAndAppendButton('bottom_button_middle', _this.config?.button_actions?.bottom_button_middle); 
            buildAndAppendButton('bottom_button_right', _this.config?.button_actions?.bottom_button_right); 
                
            //Left Buttons
            buildAndAppendButton('left_button_top', _this.config?.button_actions?.left_button_top);           
            buildAndAppendButton('left_button_middle', _this.config?.button_actions?.left_button_middle);   
            buildAndAppendButton('left_button_bottom', _this.config?.button_actions?.left_button_bottom); 
    
            //Right Buttons
            buildAndAppendButton('right_button_top', _this.config?.button_actions?.right_button_top);
            buildAndAppendButton('right_button_middle', _this.config?.button_actions?.right_button_middle); 
            buildAndAppendButton('right_button_bottom', _this.config?.button_actions?.right_button_bottom); 
            
            //Initilize Event Listeners
            ['touchstart', 'mousedown'].forEach(e => {
                touchpad.addEventListener(e, touchStart);
                buttons.forEach(bttn => bttn.addEventListener(e, buttonDown));
            });
            ['touchend', 'mouseup'].forEach(e => {
                buttons.forEach(bttn => bttn.addEventListener(e, buttonRelease));
            });
    
            // Card Creation Functions
            function buildAndAppendButton(id, button_config) {
                if(!button_config) {
                    return;
                }
                let button_div = document.createElement('div');
                button_div.className='nc-button'
                button_div.id = id;

                let button_icon = document.createElement('ha-icon');
                button_icon.icon = button_config.icon;
                button_icon.className = 'nc-button-icon';
                button_icon.config = button_config;
                button_icon.hold_repeat_ms = button_config.hold_repeat_ms;
                if(button_config.icon_color && button_config.icon_color.length === 3) {
                    button_icon.style.color = 'rgb(' + button_config.icon_color.join(',') + ')';
                }
                let default_icon_size = _this.config?.button_actions?.default_icon_size;
                let icon_size = button_config.icon_size 
                    ? button_config.icon_size + 'px' 
                    : default_icon_size ? default_icon_size + 'px' : 'auto';
                button_icon.style.setProperty('--mdc-icon-size', icon_size);
                buttons.push(button_icon);

                
                button_div.appendChild(button_icon);                
                button_div.appendChild(document.createElement('ha-ripple'));
                touchpad.appendChild(button_div);
            }

            //Event Listener Functions
            function touchStart(e) {
                e.preventDefault();
                is_two_finger_touch = e.touches && e.touches.length > 1;
    
                xDown = e.clientX || e.touches[0].clientX;
                yDown = e.clientY || e.touches[0].clientY;

                document.addEventListener('touchmove', touchMove);
                document.addEventListener('mousemove', touchMove);
                document.addEventListener('touchend', touchEnd);
                document.addEventListener('mouseup', touchEnd, false);
            }
            
            function touchMove(e) {
                xDiff = xDown - (e.clientX || e.touches[0].clientX);
                yDiff = yDown - (e.clientY || e.touches[0].clientY);
                is_swipe = Math.abs(xDiff) > 2 || Math.abs(yDiff) > 2;
            }
    
            function touchEnd(e) {
                ['touchmove', 'mousemove'].forEach(e => document.removeEventListener(e, touchMove));
                ['touchend', 'mouseup'].forEach(e => document.removeEventListener(e, touchEnd));
    
                if (is_swipe) {
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            //Left Swipe
                            is_two_finger_touch ? callHassAction(_this.config?.swipe_actions?.two_finger?.swipe_left) : callHassAction(_this.config?.swipe_actions?.one_finger?.swipe_left);
                        } else {
                            //Right Swipe
                            is_two_finger_touch ? callHassAction(_this.config?.swipe_actions?.two_finger?.swipe_right) : callHassAction(_this.config?.swipe_actions?.one_finger?.swipe_right);
                        }
                    } else {
                        if (yDiff > 0) {
                            //Up Swipe
                            is_two_finger_touch ? callHassAction(_this.config?.swipe_actions?.two_finger?.swipe_up) : callHassAction(_this.config?.swipe_actions?.one_finger?.swipe_up);
                        } else {
                            //Down Swipe
                            is_two_finger_touch ? callHassAction(_this.config?.swipe_actions?.two_finger?.swipe_down) : callHassAction(_this.config?.swipe_actions?.one_finger?.swipe_down);
                        }
                    }
                }
                else if (!e.button) {
                    callHassAction(_this.config?.button_actions?.touchpad_tap_action);
                }
                //Reset
                xDown, yDown, xDiff, yDiff = null;
                is_swipe = false;
                is_two_finger_touch = false;
            } 
    
            function buttonDown(e) {
                const currentTarget = e.currentTarget;

                if (e.cancelable) { e.preventDefault(); }
                e.stopPropagation();

                // Clear any existing timer on this specific element first to prevent stacking
                if (currentTarget._repeatTimer) { clearInterval(currentTarget._repeatTimer); }

                if ((e.type === 'touchstart' || e.button === 0) && currentTarget.hold_repeat_ms > 0) { 
                    currentTarget._repeatTimer = setInterval(() => {
                        currentTarget._hasRepeated = true; // Mark that we've started repeating
                        callHassAction(currentTarget.config);
                    }, currentTarget.hold_repeat_ms);
                }
            }
    
            function buttonRelease(e) {
                const currentTarget = e.currentTarget;
                clearInterval(currentTarget._repeatTimer)
                // Only fire the final action if it didn't already repeat while holding
                // OR if you explicitly want one final tap action.
                if (!currentTarget._hasRepeated) {
                  callHassAction(currentTarget.config);
                }
                currentTarget._hasRepeated = false; // Reset for next time
            }
    
            //Service Functions
            function callHassAction(actionConfig) {
                if(!actionConfig || !actionConfig.actions) {
                    return;
                }
                if(_this.config.haptic_feedback !== 'none') {
                    _this.dispatchEvent(new Event("haptic", {
                        bubbles: true,
                        composed: true,
                        detail: _this.config.haptic_feedback ? _this.config.haptic_feedback : 'light',
                    }));
                }
                
                //  e.currentTarget.config.action.forEach((actionItem) => {
                actionConfig.actions.forEach((actionItem) => {
                    // Construct the standard action config from the selector output
                    const actionConfig = {
                        action: "perform-action",
                        perform_action: actionItem.action, // e.g., "switch.toggle"
                        target: actionItem.target,        // e.g., { "entity_id": "..." }
                        data: actionItem.data             // any additional parameters
                    };

                    // Dispatch the standard hass action event
                    _this.dispatchEvent(new CustomEvent("hass-action", {
                        bubbles: true,
                        composed: true,
                        detail: {
                            config: { tap_action: actionConfig },
                            action: "tap",
                        },
                    }));
                });
            }        
        }

        function setBackgroundCoverArt() {
            let internalUrlPath = _this.config.background_cover_art.internal_url_path;
            let externalFullUrl = _this.config.background_cover_art.external_full_url;
            let entity = _this.config.background_cover_art.entity_id;
            let stateAttributeName = _this.config.background_cover_art.state_attribute_name ? _this.config.background_cover_art.state_attribute_name : 'entity_picture';
            
            let backgroundImageUrl = null;
            if(internalUrlPath) {
                backgroundImageUrl = hass.hassUrl(internalUrlPath);
            } else if (externalFullUrl) {
                backgroundImageUrl = externalFullUrl;
            } else if (entity){
                let urlPath = hass.states[entity]?.attributes ? hass.states[entity]?.attributes[stateAttributeName] : null;
                backgroundImageUrl =  urlPath ? hass.hassUrl(urlPath) : null;
            }


            if(backgroundImageUrl) {
                let backgroundPosition = _this.config.background_cover_art?.background_css_config?.position ? _this.config.background_cover_art?.background_css_config?.position : 'center';
                let backgroundSize = _this.config.background_cover_art?.background_css_config?.size ? _this.config.background_cover_art?.background_css_config?.size : 'cover';
                let backgroundRepeat = _this.config.background_cover_art?.background_css_config?.repeat ? _this.config.background_cover_art?.background_css_config?.repeat : '';
                _this.card.style.setProperty('background-image', 'url(' + backgroundImageUrl + ')', 'important');
                _this.card.style.setProperty('background-size', backgroundSize, 'important');
                _this.card.style.setProperty('background-position', backgroundPosition, 'important');
                _this.card.style.setProperty('background-repeat', backgroundRepeat, 'important');
            } else {
                _this.card.style.removeProperty('background-image');
                _this.card.style.removeProperty('background-size');
                _this.card.style.removeProperty('background-position');
                _this.card.style.removeProperty('background-repeat');
            }
        }
    }

    setConfig(config) {
        NavigationCard.assertConfiguration(config);
        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns. A height of 1 is 
    // equivalent to 50 pixels.
    getCardSize() {
        return 9;
    }
    getGridOptions() {
        return {
          rows: 7,
          columns: 12,
          min_rows: 2,
          min_columns: 3
        };
    }

    static getStubConfig() {
        return {"haptic_feedback": "light"}
    }
    static getConfigForm() {
        const actions = { name: "actions", selector: { action: {} } };
        const button = [
            actions,
            { type: "grid", name: "button_config_grid", flatten: true, schema: [
                { name: "icon", selector: { icon: {} } },
                { name: "icon_color", selector: { color_rgb: {} } },
                { name: "icon_size", selector: { number: { unit_of_measurement: "px" } } },
                { name: "hold_repeat_ms", selector: { number: { min: 100, max: 2000, step: 100, unit_of_measurement: "ms" } } }
            ]},
        ];
        
        return {
            schema: [
                { type: "expandable", name: "swipe_actions", schema: [
                    { type: "expandable", name: "one_finger", schema: [
                        { name: "swipe_left", type: "expandable", schema: [actions] },
                        { name: "swipe_right", type: "expandable", schema: [actions] },
                        { name: "swipe_up", type: "expandable", schema: [actions] },
                        { name: "swipe_down", type: "expandable", schema: [actions] },
                    ]},
                    { type: "expandable", name: "two_finger", schema: [
                        { name: "swipe_left", type: "expandable", schema: [actions] },
                        { name: "swipe_right", type: "expandable", schema: [actions] },
                        { name: "swipe_up", type: "expandable", schema: [actions] },
                        { name: "swipe_down", type: "expandable", schema: [actions] },
                    ]},
                ]},
                { type: "expandable", name: "button_actions", schema: [
                  { name: "default_icon_size", selector: { number: { unit_of_measurement: "px" } } },
                  { name: "touchpad_tap_action", type: "expandable", schema: [actions] },
                  { name: "top_button_left", type: "expandable", schema: button },
                  { name: "top_button_middle", type: "expandable", schema: button },
                  { name: "top_button_right", type: "expandable", schema: button },
                  { name: "bottom_button_left", type: "expandable", schema: button },
                  { name: "bottom_button_middle", type: "expandable", schema: button },
                  { name: "bottom_button_right", type: "expandable", schema: button },
                  { name: "left_button_top", type: "expandable", schema: button },
                  { name: "left_button_middle", type: "expandable", schema: button },
                  { name: "left_button_bottom", type: "expandable", schema: button },
                  { name: "right_button_top", type: "expandable", schema: button },
                  { name: "right_button_middle", type: "expandable", schema: button },
                  { name: "right_button_bottom", type: "expandable", schema: button },
                ]},
                { type: "expandable", name: "background_cover_art", schema: [
                    { name: "entity_id", selector: { entity: {} } },
                    { name: "state_attribute_name", selector: { text: {} } },
                    { name: "external_full_url", selector: { text: {} } },
                    { name: "internal_url_path", selector: { text: {} } },
                    { type: "expandable", name: "background_css_config", schema: [
                        { type: "grid", name: "background_css_grid", flatten: true, schema: [
                                { name: "size", selector: { text: {} } },
                                { name: "position", selector: { text: {} } },
                                { name: "repeat", selector: { text: {} } },
                        ]},
                    ]},
                ]},
                { name: "haptic_feedback", selector: { select: {
                    mode: "dropdown",
                    options: [
                        { label: "None", value: "none" },
                        { label: "Light", value: "light" },
                        { label: "Medium", value: "medium" },
                        { label: "Heavy", value: "heavy" },
                    ]
                }}},
            ],
            computeLabel: (schema) => {
                switch (schema.name) {
                    // 🌐 Root-level options
                    case "haptic_feedback":
                      return "Haptic Feedback";
                
                    // 👆 Swipe Actions
                    case "swipe_actions":
                      return "Swipe Actions";
                    case "one_finger":
                      return "One Finger Gestures";
                    case "two_finger":
                      return "Two Finger Gestures";
                    case "swipe_left":
                      return "Swipe Left Action";
                    case "swipe_right":
                      return "Swipe Right Action";
                    case "swipe_up":
                      return "Swipe Up Action";
                    case "swipe_down":
                      return "Swipe Down Action";
                
                    // 🔘 Button Actions
                    case "button_actions":
                      return "Buttons";
                    case "default_icon_size":
                      return "Default icon size (px)";
                    case "touchpad_tap_action":
                      return "Touchpad Tap Action (Center)";
                    case "top_button_left":
                      return "Top Button (Left)";
                    case "top_button_middle":
                      return "Top Button (Middle)";
                    case "top_button_right":
                      return "Top Button (Right)";
                    case "bottom_button_left":
                      return "Bottom Button (Left)";
                    case "bottom_button_middle":
                      return "Bottom Button (Middle)";
                    case "bottom_button_right":
                      return "Bottom Button (Right)";
                    case "left_button_top":
                      return "Left Button (Top)";
                    case "left_button_middle":
                      return "Left Button (Middle)";
                    case "left_button_bottom":
                      return "Left Button (Bottom)";
                    case "right_button_top":
                      return "Right Button (Top)";
                    case "right_button_middle":
                      return "Right Button (Middle)";
                    case "right_button_bottom":
                      return "Right Button (Bottom)";
                
                    // 🎨 Button Inner Schema
                    case "actions":
                      return "Actions";
                    case "icon":
                      return "Icon";
                    case "icon_color":
                      return "Icon Color";
                    case "icon_size":
                      return "Icon Size (px)";
                    case "hold_repeat_ms":
                      return "Hold Repeat Delay";
                
                    // 🖼️ Background / Cover Art
                    case "background_cover_art":
                      return "Background Cover Art";
                    case "entity_id":
                      return "Entity";
                    case "state_attribute_name":
                      return "State Attribute Name";
                    case "external_full_url":
                      return "External Full URL";
                    case "internal_url_path":
                      return "Internal URL Path";
                    case "background_css_config":
                      return "Background CSS Config";
                    
                      // 🎨 Background CSS Config
                    case "size":
                      return "Size (e.g. cover, 50%)";
                    case "position":
                      return "Position (e.g. center, top)";
                    case "repeat":
                      return "Repeat (e.g. no-repeat)";
                
                    // Default fallback
                    default:
                      return undefined;
                  }
            },
            computeHelper: (schema) => {
                switch (schema.name) {
                case "external_full_url":
                    return "External URL (e.g. https://design.home-assistant.io/images/brand/logo.png)";    
                case "internal_url_path":
                    return "Internal Path (e.g. /local/image.png)";
                case "default_icon_size":
                    return "Default icon size for all buttons. If left blank, the icons autosize based on the cards total width."
                case "icon_size":
                    return "Icon size for this particular button. This overides the 'Default Icon Size' and autosize functionality.";
                case "hold_repeat_ms":
                    return "Holding the button repeats the action every 100-2000 miliseconds (blank to disable)."
                }
                return undefined;
            },
            assertConfig: (config) => {
                NavigationCard.assertConfiguration(config);
            },
        };
    }
    static assertConfiguration(config) {
        if (config.background_cover_art) {
            if(!config.background_cover_art.entity_id && !config.background_cover_art.internal_url_path && !config.background_cover_art.external_full_url) {
                throw new Error('You need to define either an `entity_id`, `internal_url_path` or `external_full_url` for `background_cover_art`, or remove the config entirely in code editor');
            }
            if(config.background_cover_art.entity_id && (config.background_cover_art.internal_url_path || config.background_cover_art.external_full_url)) {
                throw new Error('You can only define one of the following configs for `background_cover_art`: `entity_id`, `internal_url_path` or `external_full_url`');
            }
            if(config.background_cover_art.internal_url_path && config.background_cover_art.external_full_url) {
                throw new Error('You can only define one of the following configs for `background_cover_art`: `entity_id`, `internal_url_path` or `external_full_url`');
            }
            if(config.background_cover_art.entity_id && !config.background_cover_art.entity_id.startsWith('media_player.')) {
                if(!config.background_cover_art.state_attribute_name) {
                    throw new Error('The `state_attribute_name` for `background_cover_art` must be defined if an `entity_id` is not a media player entity');
                }
            }
        }
        //TODO: finish rest.. Limit hold repeat ms to 100-2000 values
        var hold_repeat_ms = config.button_actions?.top_button_left?.hold_repeat_ms;
        if((hold_repeat_ms || hold_repeat_ms == 0) && (hold_repeat_ms < 100 || hold_repeat_ms > 2000)) {
            throw new Error('Hold Repeat Delay not in range of 100-2000.');
        }
    }
}

customElements.define("swipe-navigation-card", NavigationCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "swipe-navigation-card",
    name: "Swipe Navigation Card",
    preview: false, // Optional - defaults to false
    description: "A Swipe Navigation Remote Card", // Optional
    documentationURL: "https://github.com/Tjstock/swipe-navigation-card", // Adds a help link in the frontend card editor

});