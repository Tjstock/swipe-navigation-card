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
                // if (e.cancelable) {
                    e.preventDefault();
                // }

                xDown = e.clientX || e.touches[0].clientX;
                yDown = e.clientY || e.touches[0].clientY;
                    
                document.addEventListener('touchmove', pressMove);
                document.addEventListener('mousemove', pressMove);
                document.addEventListener('touchend', pressRelease);
                document.addEventListener('mouseup', pressRelease, false);
            };
            
            let pressMove = function (e) {
                
                if (xDown && yDown) {
                    xDiff = xDown - (e.clientX || e.touches[0].clientX);
                    yDiff = yDown - (e.clientY || e.touches[0].clientY);
                }
                if(Math.abs(xDiff) > 2 || Math.abs(yDiff) > 2) {
                    is_swipe = true;
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
                            _this.callHassService(hass, _this.config.swipe_left.service, _this.config.swipe_left.data);
                        } else {
                            //Right Swipe
                            _this.callHassService(hass, _this.config.swipe_right.service, _this.config.swipe_right.data);
                        }
                    } else {
                        if (yDiff > 0) {
                            //Up Swipe
                            _this.callHassService(hass, _this.config.swipe_up.service, _this.config.swipe_up.data);
                        } else {
                            //Down Swipe
                            _this.callHassService(hass, _this.config.swipe_down.service, _this.config.swipe_down.data);
                        }
                    }
                    //Reset
                    xDown, yDown, xDiff, yDiff = null;
                    is_swipe = false;
                }
                else if(e.button == undefined || e.button == 0) {
                    _this.callHassService(hass, _this.config.tap_action.service, _this.config.tap_action.data);
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
    
        // Set CSS
        const style = document.createElement('style');
        style.textContent = `
                swipe-navigation-card{ }
                ha-card {}
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
                .nc-button { justify-content: center; align-content: center; display: inline-grid; --mdc-icon-size: 48px; }
                ha-icon { display: grid; align-content:center; justify-content: center; }
                #top_button_left { grid-area: tbl;}
                #top_button_middle { grid-area: tbm; }
                #top_button_right { grid-area: tbr;  }
                #left_button_top { grid-area: lbt; }
                #left_button_middle { grid-area: lbm;  color: #E50914; }
                #left_button_bottom { grid-area: lbb;  color: #66aa33; }
                #right_button_top { grid-area: rbt; }
                #right_button_middle { grid-area: rbm; color: red;}
                #right_button_bottom { grid-area: rbb; }
                #bottom_button_left { grid-area: bbl; color: #BABABA; }
                #bottom_button_middle { grid-area: bbm; }
                #bottom_button_right { grid-area: bbr; color: #BABABA; }
            `;
        this.appendChild(style);
        
        //HA Card
        const card = document.createElement('ha-card');
        this.card = card;
        this.appendChild(card);

        //Touchpad
        let touchpad = document.createElement('div');
            touchpad.id = 'touchpad';
            touchpad.className = 'nc-touchpad';
        

        //Top Buttons
        let top_button_left = document.createElement('ha-icon-button');
            top_button_left.className = 'nc-button';
            top_button_left.id = 'top_button_left';
            top_button_left.service = this.config.top_button_left.service;
            top_button_left.service_data = this.config.top_button_left.data;
            top_button_left.innerHTML = '<ha-icon icon="mdi:menu"></ha-icon>'; 
            buttons.push(top_button_left);
        let top_button_middle = document.createElement('ha-icon-button');
            top_button_middle.className = 'nc-button';
            top_button_middle.id = 'top_button_middle';
            top_button_middle.service = this.config.top_button_middle.service;
            top_button_middle.service_data = this.config.top_button_middle.data;
            top_button_middle.innerHTML = '<ha-icon icon="mdi:power"></ha-icon>'; 
            buttons.push(top_button_middle);
        let top_button_right = document.createElement('ha-icon-button');
            top_button_right.className = 'nc-button';
            top_button_right.id = 'top_button_right';
            top_button_right.service = this.config.top_button_right.service;
            top_button_right.service_data = this.config.top_button_right.data;
            top_button_right.innerHTML = '<ha-icon icon="mdi:apps"></ha-icon>'; 
            buttons.push(top_button_right);
            
        //Left Buttons
        let left_button_top = document.createElement('ha-icon-button');
            left_button_top.className = 'nc-button';
            left_button_top.id = 'left_button_top';
            left_button_top.service = this.config.left_button_top.service;
            left_button_top.service_data = this.config.left_button_top.data;
            left_button_top.innerHTML = '<ha-icon icon="mdi:arrow-left"></ha-icon>';            
            buttons.push(left_button_top);
        let left_button_middle = document.createElement('ha-icon-button');
            left_button_middle.className = 'nc-button';
            left_button_middle.id = 'left_button_middle';
            left_button_middle.service = this.config.left_button_middle.service;
            left_button_middle.service_data = this.config.left_button_middle.data;
            left_button_middle.innerHTML = '<ha-icon icon="mdi:netflix"></ha-icon>';   
            buttons.push(left_button_middle);
        let left_button_bottom = document.createElement('ha-icon-button');
            left_button_bottom.className = 'nc-button';
            left_button_bottom.id = 'left_button_bottom';
            left_button_bottom.service = this.config.left_button_bottom.service;
            left_button_bottom.service_data = this.config.left_button_bottom.data;
            left_button_bottom.innerHTML = '<ha-icon icon="mdi:hulu"></ha-icon>'; 
            buttons.push(left_button_bottom);  

        //Right Buttons
        let right_button_top = document.createElement('ha-icon-button');
            right_button_top.className = 'nc-button';
            right_button_top.id = 'right_button_top';
            right_button_top.service = this.config.right_button_top.service;
            right_button_top.service_data = this.config.right_button_top.data;
            right_button_top.hold_repeat_enabled = this.config.right_button_top.hold_repeat_enabled | false;
            right_button_top.innerHTML = '<ha-icon icon="mdi:volume-plus"></ha-icon>'; 
            buttons.push(right_button_top);
        let right_button_middle = document.createElement('ha-icon-button');
            right_button_middle.className = 'nc-button';
            right_button_middle.id = 'right_button_middle';
            right_button_middle.service = this.config.right_button_middle.service;
            right_button_middle.service_data = this.config.right_button_middle.data;
            right_button_middle.innerHTML = '<ha-icon icon="mdi:volume-mute"></ha-icon>'; 
            buttons.push(right_button_middle);
        let right_button_bottom = document.createElement('ha-icon-button');
            right_button_bottom.className = 'nc-button';
            right_button_bottom.id = 'right_button_bottom';
            right_button_bottom.service = this.config.right_button_bottom.service;
            right_button_bottom.service_data = this.config.right_button_bottom.data;
            right_button_bottom.hold_repeat_enabled = this.config.right_button_bottom.hold_repeat_enabled | false;
            right_button_bottom.innerHTML = '<ha-icon icon="mdi:volume-minus"></ha-icon>'; 
            buttons.push(right_button_bottom);
        
        //Bottom Buttons
        let bottom_button_left = document.createElement('ha-icon-button');
            bottom_button_left.className = 'nc-button';
            bottom_button_left.id = 'bottom_button_left';
            bottom_button_left.service = this.config.bottom_button_left.service;
            bottom_button_left.service_data = this.config.bottom_button_left.data;
            bottom_button_left.innerHTML = '<ha-icon icon="mdi:rewind"></ha-icon>'; 
            buttons.push(bottom_button_left);
        let bottom_button_middle = document.createElement('ha-icon-button');
            bottom_button_middle.className = 'nc-button';
            bottom_button_middle.id = 'bottom_button_middle';
            bottom_button_middle.service = this.config.bottom_button_middle.service;
            bottom_button_middle.service_data = this.config.bottom_button_middle.data;
            bottom_button_middle.innerHTML = '<ha-icon icon="mdi:play-pause"></ha-icon>'; 
            buttons.push(bottom_button_middle);
        let bottom_button_right = document.createElement('ha-icon-button');
            bottom_button_right.className = 'nc-button';
            bottom_button_right.id = 'bottom_button_right';
            bottom_button_right.service = this.config.bottom_button_right.service;
            bottom_button_right.service_data = this.config.bottom_button_right.data;
            bottom_button_right.innerHTML = '<ha-icon icon="mdi:fast-forward"></ha-icon>'; 
            buttons.push(bottom_button_right);   
           
            
        touchpad.appendChild(top_button_left);
        touchpad.appendChild(top_button_middle);
        touchpad.appendChild(top_button_right);
        touchpad.appendChild(left_button_top);
        touchpad.appendChild(left_button_middle);
        touchpad.appendChild(left_button_bottom);
        touchpad.appendChild(right_button_top);
        touchpad.appendChild(right_button_middle);
        touchpad.appendChild(right_button_bottom);
        touchpad.appendChild(bottom_button_left);
        touchpad.appendChild(bottom_button_middle);
        touchpad.appendChild(bottom_button_right)

        card.appendChild(touchpad);
        
        return { touchpad, buttons };
    }

    callHassService(hass, domain_service , data) {
        let split = domain_service.split(".");
        var domain = split[0];
        var service = split[1];
        hass.callService(domain, service, data);
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

        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns. A height of 1 is 
    // equivalent to 50 pixels.
    getCardSize() {
        return 9;
    }
}

customElements.define("swipe-navigation-card", NavigationCard);
