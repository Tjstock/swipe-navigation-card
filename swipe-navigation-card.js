class NavigationCard extends HTMLElement {
    set hass(hass) {
        const _this = this;
        var xDown, yDown, xDiff, yDiff;
        var intervalIds = [];
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
            //CSS
            const style = document.createElement('style');
            style.textContent = `
                    #ha-card {}
                    .nc-touchpad { 
                        display: grid; 
                        gap: 20px; 
                        aspect-ratio: 1;
                        grid-template-areas: ' .  tbl tbm tbr  . ' 
                                             'lbt  .   .   .  rbt' 
                                             'lbm  .   .   .  rbm'
                                             'lbb  .   .   .  rbb'
                                             ' .  bbl bbm bbr  . '
                    }
                    .nc-button { justify-content: center; align-content: center; display: inline-grid;}
                    ha-icon { display: grid; align-content:center; justify-content: center; }
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
            buildAndAppendButton('top_button_left', _this.config.top_button_left); 
            buildAndAppendButton('top_button_middle', _this.config.top_button_middle); 
            buildAndAppendButton('top_button_right', _this.config.top_button_right); 
                
            //Left Buttons
            buildAndAppendButton('left_button_top', _this.config.left_button_top);           
            buildAndAppendButton('left_button_middle', _this.config.left_button_middle);   
            buildAndAppendButton('left_button_bottom', _this.config.left_button_bottom); 
    
            //Right Buttons
            buildAndAppendButton('right_button_top', _this.config.right_button_top);
            buildAndAppendButton('right_button_middle', _this.config.right_button_middle); 
            buildAndAppendButton('right_button_bottom', _this.config.right_button_bottom); 
            
            //Bottom Buttons
            buildAndAppendButton('bottom_button_left', _this.config.bottom_button_left); 
            buildAndAppendButton('bottom_button_middle', _this.config.bottom_button_middle); 
            buildAndAppendButton('bottom_button_right', _this.config.bottom_button_right); 
            
            //Initilize Event Listeners
            ['touchstart', 'mousedown'].forEach(e => {
                touchpad.addEventListener(e, touchStart);
                buttons.forEach(bttn => bttn.addEventListener(e, buttonDown));
            });
            ['mouseup', 'touchend'].forEach(e => {
                buttons.forEach(bttn => bttn.addEventListener(e, buttonRelease));
            });
    
            // Card Creation Functions
            function buildAndAppendButton(id, button_config) {
                if(!button_config) {
                    return;
                }
                let button = document.createElement('ha-icon-button');
                button.className = 'nc-button';
                button.id = id;
                button.service = button_config.service;
                button.service_data = button_config.data;
                button.hold_repeat_enabled = button_config.hold_repeat_enabled | false;
                button.innerHTML = '<ha-icon icon="' + button_config.icon + '"></ha-icon>';
                button.style.color = button_config.color;
                button.style.setProperty('--mdc-icon-size', button_config.size || '48px');
                buttons.push(button);
                touchpad.appendChild(button);
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
                            is_two_finger_touch ? callTwoFingerTouchService(_this.config.two_finger_swipe_left) : callHassService(hass, _this.config.swipe_left.service, _this.config.swipe_left.data);
                        } else {
                            //Right Swipe
                            is_two_finger_touch ? callTwoFingerTouchService(_this.config.two_finger_swipe_right) : callHassService(hass, _this.config.swipe_right.service, _this.config.swipe_right.data);
                        }
                    } else {
                        if (yDiff > 0) {
                            //Up Swipe
                            is_two_finger_touch ? callTwoFingerTouchService(_this.config.two_finger_swipe_up) : callHassService(hass, _this.config.swipe_up.service, _this.config.swipe_up.data);
                        } else {
                            //Down Swipe
                            is_two_finger_touch ? callTwoFingerTouchService(_this.config.two_finger_swipe_down) : callHassService(hass, _this.config.swipe_down.service, _this.config.swipe_down.data);
                        }
                    }
                }
                else if (!e.button) {
                    callHassService(hass, _this.config.tap_action.service, _this.config.tap_action.data);
                }
                //Reset
                xDown, yDown, xDiff, yDiff = null;
                is_swipe = false;
                is_two_finger_touch = false;
            } 
    
            function buttonDown(e) {
                if (e.cancelable) {
                    e.preventDefault();
                }
                e.stopPropagation();
                if (!e.button) {
                    var service = e.currentTarget.service;
                    var service_data = e.currentTarget.service_data;
    
                    if (e.currentTarget.hold_repeat_enabled) {
                        intervalIds.push(setInterval(function () {
                            callHassService(hass, service, service_data);
                        }, 250));
                    }
                }
            }
    
            function buttonRelease(e) {
                intervalIds.forEach(clearInterval);
                intervalIds = [];
                callHassService(hass, e.currentTarget.service, e.currentTarget.service_data);
            }
    
            //Service Functions
            function callTwoFingerTouchService(twoFingerConfig) {
                if(twoFingerConfig) {
                    callHassService(hass, twoFingerConfig.service, twoFingerConfig.data);
                }
            }
    
            function callHassService(hass, domain_service , data) {
                let split = domain_service.split('.');
                var domain = split[0];
                var service = split[1];
                const event = new Event('haptic', {
                    bubbles: true,
                    composed: true,
                });
                event.detail = 'light';
                _this.dispatchEvent(event);
                hass.callService(domain, service, data);
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
                let backgroundPosition = _this.config.background_cover_art?.style?.position ? _this.config.background_cover_art?.style?.position : 'center';
                let backgroundSize = _this.config.background_cover_art?.style?.size ? _this.config.background_cover_art?.style?.size : 'cover';
                let backgroundRepeat = _this.config.background_cover_art?.style?.repeat ? _this.config.background_cover_art?.style?.repeat : '';
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
        if (!config.swipe_left) {
            throw new Error('You need to define swipe_left');
        }
        if (!config.swipe_right) {
            throw new Error('You need to define swipe_right');
        }
        if (!config.swipe_up) {
            throw new Error('You need to define swipe_up');
        }
        if (!config.swipe_down) {
            throw new Error('You need to define swipe_down');
        }
        if (!config.tap_action) {
            throw new Error('You need to define tap_action');
        }
        if (config.background_cover_art) {
            if(!config.background_cover_art.entity_id && !config.background_cover_art.internal_url_path && !config.background_cover_art.external_full_url) {
                throw new Error('You need to define either an `entity_id`, `internal_url_path` or `external_full_url` for `background_cover_art`');
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

        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns. A height of 1 is 
    // equivalent to 50 pixels.
    getCardSize() {
        return 9;
    }

    static getConfigElement() {
        return document.createElement("swipe-navigation-card-editor");
    }
    static getStubConfig() {
        return {"swipe_left":{"service":"","data":{"entity_id":""}},"swipe_right":{"service":"","data":{"entity_id":""}},"swipe_up":{"service":"","data":{"entity_id":""}},"swipe_down":{"service":"","data":{"entity_id":""}},"tap_action":{"service":"","data":{"entity_id":""}},"top_button_left":{"icon":"","service":"","data":{"entity_id":""}},"top_button_middle":{"icon":"","service":"","data":{"entity_id":""}},"top_button_right":{"icon":"","service":"","data":{"entity_id":""}},"bottom_button_left":{"icon":"","service":"","data":{"entity_id":""}},"bottom_button_middle":{"icon":"","service":"","data":{"entity_id":""}},"bottom_button_right":{"icon":"","service":"","data":{"entity_id":""}},"left_button_top":{"icon":"","service":"","data":{"entity_id":""}},"left_button_middle":{"icon":"","service":"","data":{"entity_id":""}},"left_button_bottom":{"icon":"","service":"","data":{"entity_id":""}},"right_button_top":{"icon":"","service":"","hold_repeat_enabled":false,"data":{"entity_id":""}},"right_button_middle":{"icon":"","service":"","data":{"entity_id":""}},"right_button_bottom":{"icon":"","hold_repeat_enabled":false,"service":"","data":{"entity_id":""}}}
    }
}

class NavigationCardEditor extends HTMLElement {
    setConfig(config) {
        this._config = config;
    }
  
    configChanged(newConfig) {
      const event = new Event("config-changed", {
        bubbles: true,
        composed: true,
      });
      event.detail = { config: newConfig };
      this.dispatchEvent(event);
    }
}

customElements.define("swipe-navigation-card", NavigationCard);
customElements.define("swipe-navigation-card-editor", NavigationCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "swipe-navigation-card",
    name: "Swipe Navigation Card",
    preview: false, // Optional - defaults to false
    description: "A Swipe Navigation Remote Card", // Optional
    documentationURL: "https://github.com/Tjstock/swipe-navigation-card", // Adds a help link in the frontend card editor

});

