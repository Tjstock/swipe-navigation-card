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
                .nc-touchpad { width: 100%; height: 300px; position: relative; display: flex; align-items: center; justify-content: center;}
                .nc-button { width: 55px; height: 55px; --mdc-icon-button-size: auto; --mdc-icon-size: auto; position: absolute; }
                .nc-vertical-button-container { width: 55px; height: 85%;  position: absolute; display: flex; align-items: center; justify-content: center; }
                .nc-horizontal-button-container { width: 40%; height: 55px; position: absolute; display: flex; align-items: center; justify-content: center; }
                #left-container {left: 0; }
                #right-container {right: 0;}
                #top-container {top: 0; }
                #bottom-container {bottom: 0; }
                #b-button { color: #d04242; top: 0 }
                #y-button { color: #ecdb33; }
                #x-button { color: #40ccd0; bottom: 0; }
                #volumeup-button {top: 0 }
                #volumemute-button { color: red;}
                #volumedown-button { bottom: 0; }
                #view-button { left: 0; width: 35px; height: 35px; }
                #xbox-button { }
                #menu-button { right: 0; width: 35px; height: 35px; }
                #rewind-button { left: 0; }
                #playpause-button { }
                #fastforward-button { right: 0; }
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
        let b_button = document.createElement('ha-icon-button');
            b_button.className = 'nc-button';
            b_button.id = 'b-button';
            b_button.service = this.config.button_actions.b.service;
            b_button.service_data = this.config.button_actions.b.data;
            b_button.setAttribute('icon', 'mdi:alpha-b-circle');
            buttons.push(b_button);
        let x_button = document.createElement('ha-icon-button');
            x_button.className = 'nc-button';
            x_button.id = 'x-button';
            x_button.service = this.config.button_actions.x.service;
            x_button.service_data = this.config.button_actions.x.data;
            x_button.setAttribute('icon', 'mdi:alpha-x-circle');
            buttons.push(x_button);
        let y_button = document.createElement('ha-icon-button');
            y_button.className = 'nc-button';
            y_button.id = 'y-button';
            y_button.service = this.config.button_actions.y.service;
            y_button.service_data = this.config.button_actions.y.data;
            y_button.setAttribute('icon', 'mdi:alpha-y-circle');
            buttons.push(y_button);
        left_container.appendChild(b_button);
        left_container.appendChild(y_button);
        left_container.appendChild(x_button);
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
            volumeup_button.setAttribute('icon', 'mdi:volume-plus');
            buttons.push(volumeup_button);
        let volumemute_button = document.createElement('ha-icon-button');
            volumemute_button.className = 'nc-button';
            volumemute_button.id = 'volumemute-button';
            volumemute_button.service = this.config.button_actions.volume_mute.service;
            volumemute_button.service_data = this.config.button_actions.volume_mute.data;
            volumemute_button.setAttribute('icon', 'mdi:volume-mute');
            buttons.push(volumemute_button);
        let volumedown_button = document.createElement('ha-icon-button');
            volumedown_button.className = 'nc-button';
            volumedown_button.id = 'volumedown-button';
            volumedown_button.service = this.config.button_actions.volume_down.service;
            volumedown_button.service_data = this.config.button_actions.volume_down.data;
            volumedown_button.hold_repeat_enabled = this.config.button_actions.volume_down.hold_repeat_enabled | false;
            volumedown_button.setAttribute('icon', 'mdi:volume-minus');
            buttons.push(volumedown_button);
        right_container.appendChild(volumedown_button);
        right_container.appendChild(volumeup_button);
        right_container.appendChild(volumemute_button);
        touchpad.appendChild(right_container);

        //Top Button Container
        let top_container = document.createElement('div');
            top_container.id = 'top-container'
            top_container.className = 'nc-horizontal-button-container'
        let view_button = document.createElement('ha-icon-button');
            view_button.className = 'nc-button';
            view_button.id = 'view-button';
            view_button.service = this.config.button_actions.view.service;
            view_button.service_data = this.config.button_actions.view.data;
            view_button.setAttribute('icon', 'mdi:content-copy');
            buttons.push(view_button);
        let xbox_button = document.createElement('ha-icon-button');
            xbox_button.className = 'nc-button';
            xbox_button.id = 'xbox-button';
            xbox_button.service = this.config.button_actions.xbox.service;
            xbox_button.service_data = this.config.button_actions.xbox.data;
            xbox_button.setAttribute('icon', 'mdi:microsoft-xbox');
            buttons.push(xbox_button);
        let menu_button = document.createElement('ha-icon-button');
            menu_button.className = 'nc-button';
            menu_button.id = 'menu-button';
            menu_button.service = this.config.button_actions.menu.service;
            menu_button.service_data = this.config.button_actions.menu.data;
            menu_button.setAttribute('icon', 'mdi:menu');
            buttons.push(menu_button);
        top_container.appendChild(view_button);
        top_container.appendChild(xbox_button);
        top_container.appendChild(menu_button);
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
            rewind_button.setAttribute('icon', 'mdi:rewind');
            buttons.push(rewind_button);
        let playpause_button = document.createElement('ha-icon-button');
            playpause_button.className = 'nc-button';
            playpause_button.id = 'playpause-button';
            playpause_button.service = this.config.button_actions.play_pause.service;
            playpause_button.service_data = this.config.button_actions.play_pause.data;
            playpause_button.setAttribute('icon', 'mdi:play-pause');
            buttons.push(playpause_button);
        let fastforward_button = document.createElement('ha-icon-button');
            fastforward_button.className = 'nc-button';
            fastforward_button.id = 'fastforward-button';
            fastforward_button.service = this.config.button_actions.fast_forward.service;
            fastforward_button.service_data = this.config.button_actions.fast_forward.data;
            fastforward_button.setAttribute('icon', 'mdi:fast-forward');
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
        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns. A height of 1 is 
    // equivalent to 50 pixels.
    getCardSize() {
        return 6;
    }
}

customElements.define("xbox-swipe-navigation-card", NavigationCard);