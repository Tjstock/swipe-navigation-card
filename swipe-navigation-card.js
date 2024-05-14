class NavigationCard extends HTMLElement {
    set hass(hass) {
        const _this = this;
        var xDown, yDown, xDiff, yDiff;
        var is_swipe = false;
        var intervalIds = [];

        //Init the card
        if (!this.card) {

            let { touchpad, buttons } = this.buildCard();

            let pressDown = function (e) {
                if (e.cancelable) {
                    e.preventDefault();
                }

                xDown = e.clientX || e.touches[0].clientX;
                yDown = e.clientY || e.touches[0].clientY;
                    
                document.addEventListener('touchmove', pressMove);
                document.addEventListener('mousemove', pressMove);
                document.addEventListener('touchend', pressRelease);
                document.addEventListener('mouseup', pressRelease);
            };
            
            let pressMove = function (e) {
                is_swipe = true;
                if (xDown && yDown) {
                    xDiff = xDown - (e.clientX || e.touches[0].clientX);
                    yDiff = yDown - (e.clientY || e.touches[0].clientY);
                }
            };

            let pressRelease = function (e) {
                document.removeEventListener('touchmove', pressMove);
                document.removeEventListener('mousemove', pressMove);
                document.removeEventListener('touchend', pressRelease);
                document.removeEventListener('mouseup', pressRelease);

                if(is_swipe) {
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            //Left Swipe
                            _this.callHassService(hass, _this.config.swipe_actions.left.service, _this.config.swipe_actions.left.data);
                        } else {
                            //Right Swipe
                            _this.callHassService(hass, _this.config.swipe_actions.right.service, _this.config.swipe_actions.right.data);
                        }
                    } else {
                        if (yDiff > 0) {
                            //Up Swipe
                            _this.callHassService(hass, _this.config.swipe_actions.up.service, _this.config.swipe_actions.up.data);
                        } else {
                            //Down Swipe
                            _this.callHassService(hass, _this.config.swipe_actions.down.service, _this.config.swipe_actions.down.data);
                        }
                    }
                    //Reset
                    xDown, yDown, xDiff, yDiff = null;
                    is_swipe = false;
                }
                else if(e.button == undefined || e.button == 0) {
                    _this.callHassService(hass, _this.config.button_actions.touchpad.service, _this.config.button_actions.touchpad.data);
                }
            }; 

            let buttonDown = function (e) {
                if (e.cancelable) {
                    e.preventDefault();
                }
                e.stopPropagation();
                if(e.button == undefined || e.button == 0) {
                    var service = e.currentTarget.service;
                    var service_data = e.currentTarget.service_data;

                    if(e.currentTarget.hold_repeat_enabled) {
                        intervalIds.push(setInterval(function() {
                            _this.callHassService(hass, service, service_data);
                        }, 250));
                    }
                }
            };

            let buttonRelease = function (e) {
                intervalIds.forEach(clearInterval);
                intervalIds = [];
                _this.callHassService(hass, e.currentTarget.service, e.currentTarget.service_data);
            };
            
            //Initilize Event Listeners
            ['touchstart','mousedown'].forEach(function(e) {
                touchpad.addEventListener(e, pressDown);
                buttons.forEach(function(b) {
                    b.addEventListener(e, buttonDown);
                });
            });
            ['mouseup','touchend'].forEach(function(e) {
                buttons.forEach(function(b) {
                    b.addEventListener(e, buttonRelease);
                });
            });
        }
    }

    buildCard() {  
        let buttons = [];

        //HA Card
        const card = document.createElement('ha-card');
        this.card = card;
        this.appendChild(card);

        const style = document.createElement('style');
        style.textContent = `
                xbox-swipe-navigation-card {height:100%}
                ha-card {height: 100%; min-height: 450px}
                .nc-touchpad { width: 100%; height: 100%; min-height: 450px; position: relative; display: flex; align-items: center; justify-content: center;}
                .nc-button { width: 65px; height: 65px; --mdc-icon-button-size: auto; --mdc-icon-size: auto; position: absolute; }
                .nc-vertical-button-container { width: 65px; height: 75%;  position: absolute; display: flex; align-items: center; justify-content: center; }
                .nc-horizontal-button-container { width: 55%; height: 65px; position: absolute; display: flex; align-items: center; justify-content: center; }
                #left-container {left: 0; }
                #right-container {right: 0;}
                #top-container {top: 0; }
                #bottom-container {bottom: 0; }
                #lc_button_top { top: 0 }
                #lc_button_middle { color: #E50914; }
                #lc_button_bottom { color: #66aa33; bottom: 0; }
                #volumeup-button {top: 0 }
                #volumemute-button { color: red;}
                #volumedown-button { bottom: 0; }
                #tc_button_left { left: 0; width: 40px; height: 40px; }
                #tc_button_middle { }
                #tc_button_right { right: 0; width: 40px; height: 40px; }
                #rewind-button { left: 0; color: #BABABA; }
                #playpause-button { }
                #fastforward-button { right: 0; color: #BABABA; }
            `;
        this.appendChild(style);  

        //Touchpad
        let touchpad = document.createElement('div');
            touchpad.id = 'touchpad';
            touchpad.className = 'nc-touchpad';
        card.appendChild(touchpad);

        //Left Button Container
        let left_container = document.createElement('div');
            left_container.id = 'left-container'
            left_container.className = 'nc-vertical-button-container'
        let lc_button_top = document.createElement('ha-icon-button');
            lc_button_top.className = 'nc-button';
            lc_button_top.id = 'lc_button_top';
            lc_button_top.service = this.config.button_actions.b.service;
            lc_button_top.service_data = this.config.button_actions.b.data;
            lc_button_top.innerHTML = '<ha-icon icon="mdi:arrow-left"></ha-icon>';            
            buttons.push(lc_button_top);
        let lc_button_middle = document.createElement('ha-icon-button');
            lc_button_middle.className = 'nc-button';
            lc_button_middle.id = 'lc_button_middle';
            lc_button_middle.service = this.config.button_actions.x.service;
            lc_button_middle.service_data = this.config.button_actions.x.data;
            lc_button_middle.innerHTML = '<ha-icon icon="mdi:netflix"></ha-icon>';   
            buttons.push(lc_button_middle);
        let lc_button_bottom = document.createElement('ha-icon-button');
            lc_button_bottom.className = 'nc-button';
            lc_button_bottom.id = 'lc_button_bottom';
            lc_button_bottom.service = this.config.button_actions.y.service;
            lc_button_bottom.service_data = this.config.button_actions.y.data;
            lc_button_bottom.innerHTML = '<ha-icon icon="mdi:hulu"></ha-icon>'; 
            buttons.push(lc_button_bottom);
        left_container.appendChild(lc_button_top);
        left_container.appendChild(lc_button_middle);
        left_container.appendChild(lc_button_bottom);
        touchpad.appendChild(left_container);

        //Right Button Container
        let right_container = document.createElement('div');
            right_container.id = 'right-container'
            right_container.className = 'nc-vertical-button-container'
        let volumeup_button = document.createElement('ha-icon-button');
            volumeup_button.className = 'nc-button';
            volumeup_button.id = 'volumeup-button';
            volumeup_button.service = this.config.button_actions.volume_up.service;
            volumeup_button.service_data = this.config.button_actions.volume_up.data;
            volumeup_button.hold_repeat_enabled = this.config.button_actions.volume_up.hold_repeat_enabled | false;
            volumeup_button.innerHTML = '<ha-icon icon="mdi:volume-plus"></ha-icon>'; 
            buttons.push(volumeup_button);
        let volumemute_button = document.createElement('ha-icon-button');
            volumemute_button.className = 'nc-button';
            volumemute_button.id = 'volumemute-button';
            volumemute_button.service = this.config.button_actions.volume_mute.service;
            volumemute_button.service_data = this.config.button_actions.volume_mute.data;
            volumemute_button.innerHTML = '<ha-icon icon="mdi:volume-mute"></ha-icon>'; 
            buttons.push(volumemute_button);
        let volumedown_button = document.createElement('ha-icon-button');
            volumedown_button.className = 'nc-button';
            volumedown_button.id = 'volumedown-button';
            volumedown_button.service = this.config.button_actions.volume_down.service;
            volumedown_button.service_data = this.config.button_actions.volume_down.data;
            volumedown_button.hold_repeat_enabled = this.config.button_actions.volume_down.hold_repeat_enabled | false;
            volumedown_button.innerHTML = '<ha-icon icon="mdi:volume-minus"></ha-icon>'; 
            buttons.push(volumedown_button);
        right_container.appendChild(volumedown_button);
        right_container.appendChild(volumeup_button);
        right_container.appendChild(volumemute_button);
        touchpad.appendChild(right_container);

        //Top Button Container
        let top_container = document.createElement('div');
            top_container.id = 'top-container'
            top_container.className = 'nc-horizontal-button-container'
        let tc_button_left = document.createElement('ha-icon-button');
            tc_button_left.className = 'nc-button';
            tc_button_left.id = 'tc_button_left';
            tc_button_left.service = this.config.button_actions.view.service;
            tc_button_left.service_data = this.config.button_actions.view.data;
            tc_button_left.innerHTML = '<ha-icon icon="mdi:menu"></ha-icon>'; 
            buttons.push(tc_button_left);
        let tc_button_middle = document.createElement('ha-icon-button');
            tc_button_middle.className = 'nc-button';
            tc_button_middle.id = 'tc_button_middlen';
            tc_button_middle.service = this.config.button_actions.xbox.service;
            tc_button_middle.service_data = this.config.button_actions.xbox.data;
            tc_button_middle.innerHTML = '<ha-icon icon="mdi:power"></ha-icon>'; 
            buttons.push(tc_button_middle);
        let tc_button_right = document.createElement('ha-icon-button');
            tc_button_right.className = 'nc-button';
            tc_button_right.id = 'tc_button_right';
            tc_button_right.service = this.config.button_actions.menu.service;
            tc_button_right.service_data = this.config.button_actions.menu.data;
            tc_button_right.innerHTML = '<ha-icon icon="mdi:apps"></ha-icon>'; 
            buttons.push(tc_button_right);
        top_container.appendChild(tc_button_left);
        top_container.appendChild(tc_button_middle);
        top_container.appendChild(tc_button_right);
        touchpad.appendChild(top_container);
        
        //Bottom Button Container
        let bottom_container = document.createElement('div');
            bottom_container.id = 'bottom-container'
            bottom_container.className = 'nc-horizontal-button-container'
        let rewind_button = document.createElement('ha-icon-button');
            rewind_button.className = 'nc-button';
            rewind_button.id = 'rewind-button';
            rewind_button.service = this.config.button_actions.rewind.service;
            rewind_button.service_data = this.config.button_actions.rewind.data;
            rewind_button.innerHTML = '<ha-icon icon="mdi:rewind"></ha-icon>'; 
            buttons.push(rewind_button);
        let playpause_button = document.createElement('ha-icon-button');
            playpause_button.className = 'nc-button';
            playpause_button.id = 'playpause-button';
            playpause_button.service = this.config.button_actions.play_pause.service;
            playpause_button.service_data = this.config.button_actions.play_pause.data;
            playpause_button.innerHTML = '<ha-icon icon="mdi:play-pause"></ha-icon>'; 
            buttons.push(playpause_button);
        let fastforward_button = document.createElement('ha-icon-button');
            fastforward_button.className = 'nc-button';
            fastforward_button.id = 'fastforward-button';
            fastforward_button.service = this.config.button_actions.fast_forward.service;
            fastforward_button.service_data = this.config.button_actions.fast_forward.data;
            fastforward_button.innerHTML = '<ha-icon icon="mdi:fast-forward"></ha-icon>'; 
            buttons.push(fastforward_button);
        bottom_container.appendChild(rewind_button);
        bottom_container.appendChild(playpause_button);
        bottom_container.appendChild(fastforward_button)
        touchpad.appendChild(bottom_container);

        return { touchpad, buttons };
    }

    callHassService(hass, domain_service , data) {
        let split = domain_service.split(".");
        var domain = split[0];
        var service = split[1];
        hass.callService(domain, service, data);
    }

    setConfig(config) {
        if (!config.swipe_actions.left) {
            throw new Error('You need to define swipe_actions.left');
        }
        if (!config.swipe_actions.right) {
            throw new Error('You need to define swipe_actions.right');
        }
        if (!config.swipe_actions.up) {
            throw new Error('You need to define swipe_actions.up');
        }
        if (!config.swipe_actions.down) {
            throw new Error('You need to define swipe_actions.down');
        }
        if (!config.swipe_actions.down) {
            throw new Error('You need to define swipe_actions.down');
        }

        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns. A height of 1 is 
    // equivalent to 50 pixels.
    getCardSize() {
        return 9;
    }
}

customElements.define("xbox-swipe-navigation-card", NavigationCard);
