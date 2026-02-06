class NavigationCard extends HTMLElement {
    //TODO: cleanup placement of functions, create helper classes, variables, css variables etc.
    set hass(hass) {
        const _this = this;
        let xDown, yDown, xDiff, yDiff;
        let is_swipe = false;
        let is_two_finger_touch = false;

        //Initialize the Card if it's not there yet
        if (!this.card) {
            initializeCard();
        }

        //TODO: add support for visual swipe of background like legende showed in https://github.com/Tjstock/swipe-navigation-card/issues/5 
        if(this.config.background_cover_art && Object.keys(this.config.background_cover_art).length != 0) {
            setBackgroundCoverArt();
        }
        
        function initializeCard() {
            //CSS
            const style = document.createElement('style');
            style.textContent = `
                    ha-card { height: 100%; overflow: clip;}
                    .nc-touchpad {
                        height: 100%;
                        width: 100%;
                        padding: 5px;
                        box-sizing: border-box;
                        display: grid;
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                        grid-template-rows: repeat(5, minmax(0, 1fr));
                        grid-template-areas: 'cbtl tbl tbm tbr cbtr' 
                                             'lbt   .   .   .  rbt' 
                                             'lbm   .   .   .  rbm'
                                             'lbb   .   .   .  rbb'
                                             'cbbl bbl bbm bbr cbbr'
                    }
                    .nc-button-container {
                        display: flex;
                        justify-content: center;
                        align-items:center;
                        height: 100%;
                        width: 100%;
                        container-type: size;
                    }
                    .nc-button {
                        height: fit-content;
                        width: fit-content;
                        border-radius: 50%; 
                    }
                    .nc-button-icon {
                        display: flex;
                        height: fit-content;
                        width: fit-content;
                        cursor: pointer;
                    }
                    #top_button_left_container { grid-area: tbl;}
                    #top_button_middle_container { grid-area: tbm; }
                    #top_button_right_container { grid-area: tbr;  }
                    #left_button_top_container { grid-area: lbt; }
                    #left_button_middle_container { grid-area: lbm; }
                    #left_button_bottom_container { grid-area: lbb; }
                    #right_button_top_container { grid-area: rbt; }
                    #right_button_middle_container { grid-area: rbm; }
                    #right_button_bottom_container { grid-area: rbb; }
                    #bottom_button_left_container { grid-area: bbl; }
                    #bottom_button_middle_container { grid-area: bbm; }
                    #bottom_button_right_container { grid-area: bbr; }
                    #corner_button_top_left_container { grid-area: cbtl; }
                    #corner_button_top_right_container { grid-area: cbtr; }
                    #corner_button_bottom_left_container { grid-area: cbbl; }
                    #corner_button_bottom_right_container { grid-area: cbbr; }
                `;
            
            //HA Card
            const card = document.createElement('ha-card');
            _this.card = card;
            card.appendChild(style);
            _this.appendChild(card);        
            
            //Build Touchpad
            const touchpad = document.createElement('div');
            touchpad.id = 'touchpad';
            touchpad.className = 'nc-touchpad';
            touchpad.style.gap = `${_this.config?.button_actions?.grid_gap ?? 0}px`;
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
            
            //Corner Buttons
            buildAndAppendButton('corner_button_top_left', _this.config?.button_actions?.corner_button_top_left);
            buildAndAppendButton('corner_button_top_right', _this.config?.button_actions?.corner_button_top_right); 
            buildAndAppendButton('corner_button_bottom_left', _this.config?.button_actions?.corner_button_bottom_left);
            buildAndAppendButton('corner_button_bottom_right', _this.config?.button_actions?.corner_button_bottom_right);
            
            //Initilize Event Listeners
            ['touchstart', 'mousedown'].forEach(e => {
                touchpad.addEventListener(e, touchStart);
                buttons.forEach(bttn => bttn.addEventListener(e, buttonDown));
            });
            ['touchend', 'mouseup'].forEach(e => {
                buttons.forEach(bttn => bttn.addEventListener(e, buttonRelease));
            });
            
            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    // Calculate icon size: 10% of card min(width, height).
                    const parentHeight = entry.contentRect.height;
                    const parentWidth = entry.contentRect.width;
                    const newSize = Math.max(10, Math.min(parentWidth, parentHeight) * 0.1);
                    
                    // Apply the size directly to the icon size variable
                    entry.target.style.setProperty('--mdc-icon-size', `${newSize}px`);
                }
            });
            resizeObserver.observe(card);

            // Card Creation Functions
            function buildAndAppendButton(id, button_config) {
                if(!button_config) {
                    return;
                }
                /**nc-button-container */
                const nc_button_container = document.createElement('div');
                nc_button_container.className='nc-button-container';
                nc_button_container.id = id + '_container';
                /**nc-button */
                const nc_button = document.createElement('div');
                nc_button.className='nc-button'
                nc_button.id = id;
                const horizontal_adjustment = button_config.horizontal_adjustment ? button_config.horizontal_adjustment : 0;
                const vertical_adjustment = button_config.vertical_adjustment ? button_config.vertical_adjustment : 0;
                nc_button.style.translate = `${horizontal_adjustment}cqw ${vertical_adjustment}cqh`;

                /**nc-button-icon */
                const nc_button_icon = document.createElement('ha-icon');
                nc_button_icon.icon = button_config.icon;
                nc_button_icon.className = 'nc-button-icon';
                nc_button_icon.config = button_config;
                //Hold Repeat Delay
                nc_button_icon.hold_repeat_ms = button_config?.hold_repeat_ms;
                //Icon Color
                if(button_config?.icon_color?.length === 3) {
                    nc_button_icon.style.color = `rgb(${button_config.icon_color.join(',')})`;
                }
                //Icon Size
                const icon_size = button_config.icon_size 
                    ? button_config.icon_size 
                    : _this.config?.button_actions?.default_icon_size;
                if(icon_size) {
                    nc_button_icon.style.setProperty('--mdc-icon-size', `${icon_size}px`);
                }

                buttons.push(nc_button_icon);                
                nc_button.appendChild(nc_button_icon);                
                nc_button.appendChild(document.createElement('ha-ripple'));
                nc_button_container.appendChild(nc_button);
                touchpad.appendChild(nc_button_container);
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
                            is_two_finger_touch ? callHassAction(_this.config?.swipe_actions?.two_finger?.swipe_left, 'tap') : callHassAction(_this.config?.swipe_actions?.one_finger?.swipe_left, 'tap');
                        } else {
                            //Right Swipe
                            is_two_finger_touch ? callHassAction(_this.config?.swipe_actions?.two_finger?.swipe_right, 'tap') : callHassAction(_this.config?.swipe_actions?.one_finger?.swipe_right, 'tap');
                        }
                    } else {
                        if (yDiff > 0) {
                            //Up Swipe
                            is_two_finger_touch ? callHassAction(_this.config?.swipe_actions?.two_finger?.swipe_up, 'tap') : callHassAction(_this.config?.swipe_actions?.one_finger?.swipe_up, 'tap');
                        } else {
                            //Down Swipe
                            is_two_finger_touch ? callHassAction(_this.config?.swipe_actions?.two_finger?.swipe_down, 'tap') : callHassAction(_this.config?.swipe_actions?.one_finger?.swipe_down, 'tap');
                        }
                    }
                }
                else if (!e.button) {
                    callHassAction(_this.config?.button_actions?.touchpad_tap_action, 'tap');
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
                if (currentTarget._holdTimer) { clearInterval(currentTarget._holdTimer); }

                if (e.type === 'touchstart' || e.button === 0) { 
                    const action = currentTarget.config?.hold_action?.action ?? 'none';
                    const actionType = action === 'none' ? 'tap' : 'hold';
                    if(currentTarget.hold_repeat_ms > 0) {
                        currentTarget._holdTimer = setInterval(() => {
                            currentTarget._isHold = true;
                            callHassAction(currentTarget.config, actionType);
                        }, currentTarget.hold_repeat_ms);
                    } else {
                        currentTarget._holdTimer = setTimeout(() => {
                            currentTarget._isHold = true;
                            callHassAction(currentTarget.config, actionType);
                        }, 500);  //Home Assistant default for holds
                    }
                }
            }
    
            function buttonRelease(e) {
                const currentTarget = e.currentTarget;
                clearInterval(currentTarget._holdTimer)
                // Only fire the final action if it didn't already repeat while holding
                // OR if you explicitly want one tap action.
                if (!currentTarget._isHold) {
                    callHassAction(currentTarget.config, 'tap');
                }
                currentTarget._isHold = false; // Reset for next time
            }
    
            //Service Functions
            function callHassAction(actionConfig, actionType) {
                // Validate input and ensure the specific action block exists (tap_action, hold_action, double_tap_action)
                if (!actionConfig || !actionConfig[`${actionType}_action`]) {
                    return;
                }

                // Create a clone so we don't mutate the card's permanent config
                const configPayload = { ...actionConfig };
                // Inject the specific entity mapping for the "more-info" or "toggle" handler. This maps the custom 'tap_entity' etc. to the 'entity' key HA expects
                configPayload.entity = actionConfig[`${actionType}_entity`] || actionConfig.entity;
                // Dispatch the standard hass action event
                _this.dispatchEvent(new CustomEvent("hass-action", {
                    bubbles: true,
                    composed: true,
                    detail: {
                        config: configPayload, // must contain tap_action, hold_action, or double_tap_action
                        action: actionType, // Must be "tap", "hold", or "double_tap"
                    },
                }));
            }

        }

        function setBackgroundCoverArt() {
            const internalUrlPath = _this.config.background_cover_art.internal_url_path;
            const externalFullUrl = _this.config.background_cover_art.external_full_url;
            const entity = _this.config.background_cover_art.entity;
            const stateAttributeName = _this.config.background_cover_art.state_attribute_name ? _this.config.background_cover_art.state_attribute_name : 'entity_picture';
            
            let backgroundImageUrl = null;
            if(internalUrlPath) {
                backgroundImageUrl = hass.hassUrl(internalUrlPath);
            } else if (externalFullUrl) {
                backgroundImageUrl = externalFullUrl;
            } else if (entity){
                const urlPath = hass.states[entity]?.attributes ? hass.states[entity]?.attributes[stateAttributeName] : null;
                backgroundImageUrl =  urlPath ? hass.hassUrl(urlPath) : null;
            }
            
            if(backgroundImageUrl) {
                const backgroundPosition = _this.config.background_cover_art?.background_css_config?.position ? _this.config.background_cover_art?.background_css_config?.position : 'center';
                const backgroundSize = _this.config.background_cover_art?.background_css_config?.size ? _this.config.background_cover_art?.background_css_config?.size : 'cover';
                const backgroundRepeat = _this.config.background_cover_art?.background_css_config?.repeat ? _this.config.background_cover_art?.background_css_config?.repeat : 'no-repeat';
                const lightenDarkenPercent = _this.config.background_cover_art?.background_css_config?.lighten_darken;
                _this.card.style.setProperty('background-image', 'url(' + backgroundImageUrl + ')', 'important');
                _this.card.style.setProperty('background-size', backgroundSize, 'important');
                _this.card.style.setProperty('background-position', backgroundPosition, 'important');
                _this.card.style.setProperty('background-repeat', backgroundRepeat, 'important');                
                if(lightenDarkenPercent > 0) {
                    _this.card.style.setProperty('background-blend-mode', "overlay");
                    _this.card.style.setProperty('background-color', `rgba(0,0,0, ${lightenDarkenPercent/100})`);
                }else if(lightenDarkenPercent < 0) {
                    _this.card.style.setProperty('background-blend-mode', "overlay");
                    _this.card.style.setProperty('background-color', `rgba(255,255,255, ${Math.abs(lightenDarkenPercent/100)})`);
                }
                
            } else {
                _this.card.style.removeProperty('background-image');
                _this.card.style.removeProperty('background-size');
                _this.card.style.removeProperty('background-position');
                _this.card.style.removeProperty('background-repeat');
                _this.card.style.removeProperty('background-blend-mode');
                _this.card.style.removeProperty('background-color');
            }
        }
    }
    setConfig(config) {
        /** Background Cover Art */
        if (config.background_cover_art && Object.keys(config.background_cover_art).length != 0) {
            if((config.background_cover_art.internal_url_path && config.background_cover_art.external_full_url) 
                    || config.background_cover_art.entity && (config.background_cover_art.internal_url_path || config.background_cover_art.external_full_url)) {
                throw new Error('You can only define one of the following configs for `background_cover_art`: `entity`, `internal_url_path` or `external_full_url`');
            }
            if(config.background_cover_art.entity && !config.background_cover_art?.entity.startsWith('media_player.')) {
                if(!config.background_cover_art.state_attribute_name) {
                    throw new Error('The `state_attribute_name` for `background_cover_art` must be defined if the entity is not of media player domain');
                }
            }
        }

        /** Repeat Delay */
        if (config.button_actions) {
            Object.values(config.button_actions).forEach(button => {
                const hold_repeat_ms = button?.hold_repeat_ms;
                if((hold_repeat_ms || hold_repeat_ms == 0) && (hold_repeat_ms < 100 || hold_repeat_ms > 2000)) {
                    throw new Error("Hold Repeat Delay not in range of 100-2000 milliseconds.");
                }
            });
        }
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
        return {}
    }
    //TODO: use dynamic render to make dynamic for entity based on selection of ui_action
    static getConfigForm() {
        const tap_action = { type: "expandable", name: "tap_action_expandable", label: "Tap Action", flatten: true, schema: [
                                { name: "tap_action", label: "Tap behavior", selector: { ui_action: {actions: ["perform-action", "toggle", "more-info", "navigate", "url", "assist", "none" ], default_action: "none"} } },
                                { name: "tap_entity", label: "Toggle/More Info Target", selector: { entity: {} } }
                            ]};
        const swipe_action = [
                                { name: "tap_action", label: "Swipe behavior", selector: { ui_action: {actions: ["perform-action", "toggle", "more-info", "navigate", "url", "assist", "none" ], default_action: "none"} } },
                                { name: "tap_entity", label: "Toggle/More Info Target", selector: { entity: {} } }
                             ];
        const hold_action = { type: "expandable", name: "hold_action_expandable", label: "Hold Action", flatten: true, schema: [
                                { name: "hold_repeat_ms", label: "Hold repeat delay",  selector: { number: { min: 100, max: 1000, step: 50, unit_of_measurement: "ms" } } },
                                { name: "hold_action", label: "Hold behavior", selector: { ui_action: {actions: ["perform-action", "toggle", "more-info", "navigate", "url", "assist", "none"], default_action: "none"} } },
                                { name: "hold_entity", label: "Toggle/More Info Target", selector: { entity: {} } },
                            ]};
        const button = [
                            { type: "grid", name: "button_config_grid", flatten: true, schema: [
                                { name: "icon", label: "Icon", selector: { icon: {} } },
                                { name: "icon_color", label: "Icon color", selector: { color_rgb: {} } },
                                { name: "icon_size", label: "Icon size (px)", selector: { number: { unit_of_measurement: "px" } } },
                            ]},
                            { type: "grid", name: "button_config_adjustment_expandable", label: "Button Alignment", flatten: true, schema: [
                                { name: "vertical_adjustment", label: "Vertical adjustment", default: 0, selector: { number: { min: -100, max: 100, step: "any", unit_of_measurement: "%" } } },
                                { name: "horizontal_adjustment", label: "Horizontal adjustment", default: 0, selector: { number: { min: -100, max: 100, step: "any", unit_of_measurement: "%" } } }
                            ]},
                            tap_action,
                            hold_action
                        ];
        
        return {
            schema: [
                { type: "expandable", name: "swipe_actions", label: "Swipe Gestures", schema: [
                    { type: "expandable", name: "one_finger", label: "One Finger", schema: [
                        { type: "expandable", name: "swipe_left", label: "Swipe Left Action", schema: swipe_action },
                        { type: "expandable", name: "swipe_right", label: "Swipe Right Action",schema: swipe_action },
                        { type: "expandable", name: "swipe_up", label: "Swipe Up Action", schema: swipe_action },
                        { type: "expandable", name: "swipe_down", label: "Swipe Down Action", schema: swipe_action },
                    ]},
                    { type: "expandable", name: "two_finger", label: "Two Finger", schema: [
                        { type: "expandable", name: "swipe_left", label: "Swipe Left Action", schema: swipe_action },
                        { type: "expandable", name: "swipe_right", label: "Swipe Right Action", schema: swipe_action },
                        { type: "expandable", name: "swipe_up", label: "Swipe Up Action", schema: swipe_action },
                        { type: "expandable", name: "swipe_down", label: "Swipe Down Action", schema: swipe_action },
                    ]},
                ]},
                { type: "expandable", name: "button_actions", label: "Buttons", schema: [
                    { type: "grid", name: "button_config_grid", flatten: true, schema: [
                        { name: "default_icon_size", label:"Default icon size (px)", default: "auto", selector: { number: { min: 0, step: "any", unit_of_measurement: "px" } } },
                        { name: "grid_gap", label:"Grid gap (px)", default: 0, selector: { number: { min: 0, step: "any", unit_of_measurement: "px" } } }
                    ]},
                    { type: "expandable", name: "touchpad_tap_action", label: "Touchpad Tap Action (Center)", schema: [tap_action] },
                    { type: "expandable", name: "top_button_left", label: "Top Button (Left)", schema: button },
                    { type: "expandable", name: "top_button_middle", label: "Top Button (Middle)", schema: button },
                    { type: "expandable", name: "top_button_right", label: "Top Button (Right)", schema: button },
                    { type: "expandable", name: "bottom_button_left", label: "Bottom Button (Left)", schema: button },
                    { type: "expandable", name: "bottom_button_middle", label: "Bottom Button (Middle)", schema: button },
                    { type: "expandable", name: "bottom_button_right", label: "Bottom Button (Right)", schema: button },
                    { type: "expandable", name: "left_button_top", label: "Left Button (Top)", schema: button },
                    { type: "expandable", name: "left_button_middle", label: "Left Button (Middle)", schema: button },
                    { type: "expandable", name: "left_button_bottom", label: "Left Button (Bottom)", schema: button },
                    { type: "expandable", name: "right_button_top", label: "Right Button (Top)", schema: button },
                    { type: "expandable", name: "right_button_middle", label: "Right Button (Middle)", schema: button },
                    { type: "expandable", name: "right_button_bottom", label: "Right Button (Bottom)", schema: button },
                    { type: "expandable", name: "corner_button_top_left", label: "Corner Button (Top Left)", schema: button },
                    { type: "expandable", name: "corner_button_top_right", label: "Corner Button (Top Right)", schema: button },
                    { type: "expandable", name: "corner_button_bottom_left", label: "Corner Button (Bottom Left)", schema: button },
                    { type: "expandable", name: "corner_button_bottom_right", label: "Corner Button (Bottom Right)", schema: button },
                ]},
                { type: "expandable", name: "background_cover_art", label: "Background Cover Art",  schema: [
                    { name: "entity", label: "Entity", selector: { entity: {} } },
                    { name: "state_attribute_name", label: "State Attribute Name", selector: { text: {} } },
                    { name: "external_full_url", label: "External Full URL", selector: { text: {} } },
                    { name: "internal_url_path", label: "Internal URL Path", selector: { text: {} } },
                    { type: "expandable", name: "background_css_config", label: "Background CSS Config", schema: [
                        { type: "grid", name: "background_css_grid", flatten: true, schema: [
                                { name: "size", label: "Size (e.g. cover, 50%)", default: "cover", selector: { text: {} } },
                                { name: "position", label: "Position (e.g. center, top)", default: "center", selector: { text: {} } },
                                { name: "repeat", label: "Repeat (e.g. no-repeat)", default: "no-repeat", selector: { text: {} } },
                                { name: "lighten_darken", label: "Lighten/Darken", default: 0, selector: { number: { min: -100, max: 100, step: "any", unit_of_measurement: "%" } } },
                                
                        ]}
                    ]}
                ]}
            ],
            computeLabel: (schema) => {
                if(schema.label) {
                    return schema.label;
                }
                return undefined;
            },
            computeHelper: (schema) => {
                if(schema.label === "Toggle/More Info Target") {
                    return "If using the 'Toggle' or 'More info' behavior, this field is required. For all other behaviors leave this blank. "
                }
                switch (schema.name) {
                    case "state_attribute_name":
                        return "The entity's state attribute that points to an internal url path. Defaults to 'entity_picture'."
                    case "external_full_url":
                        return "External URL (e.g. https://design.home-assistant.io/images/brand/logo.png)";    
                    case "internal_url_path":
                        return "Internal Path (e.g. /local/image.png)";
                    case "lighten_darken":
                        return "Lighten or darken the background image to make button icons more visible. Negative values lighten, positive values darken.";
                    case "default_icon_size":
                        return "Default icon size for all buttons, blank to autosize."
                    case "grid_gap":
                        return "Pushes the buttons closer to the cards edge."
                    case "icon_size":
                        return "Icon size for this particular button. This overides the 'Default Icon Size' and autosize functionality.";
                    case "hold_repeat_ms":
                        return "Holding the button repeats the action every 100-2000 miliseconds, blank to disable."
                                + " A Hold action behavior of 'Nothing' will use the configured Tap action if this value is set."
                                + " Configuring the 'Repeats', 'Delay Seconds', or 'Hold Seconds' config for a remote action may create unintended funcitonality if this config is also set."
                    case "vertical_adjustment":
                        return "Moves the button up or down, blank to center. Can set out of range of the slider.";
                    case "horizontal_adjustment":
                        return "Moves the button left or right, blank to center. Can set out of range of the slider.";
                }
                return undefined;
            },
            assertConfig: (config) => {
                // Errors thrown here will disable the UI editor and open the raw config editor with the error message displayed
            },
        };
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