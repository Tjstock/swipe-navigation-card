[!["GitHub Release"](https://img.shields.io/github/v/release/tjstock/swipe-navigation-card.svg?style=for-the-badge)](https://github.com/Tjstock/swipe-navigation-card/releases)
[!["Community Forum"](https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge)](https://community.home-assistant.io/t/swipe-navigation-remote-card/729641)

<a href="https://buymeacoffee.com/tjstock"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" width="110"/></a>
<a href="https://buymeabitcoffee.vercel.app/btc/bc1q2arc23vwxccv3yjssymc87ar0cvjycwkahgw57?identifier=Buy+Me+a+BitCoffee&lightning=tstock%40speed.app"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Beer-f7931a?logo=bitcoin&logoColor=white&color=f7931a&style=flat" alt="Buy Me a BitCoffee badge" width="125"/></a>

# Swipe Navigation Card
A card that allows you to control your media devices and/or any other entity types by using swipe gestures and buttons.

![Card Example](/exampleimages/example-card.png)
## Features
##### _Dont see a feature you want added? Create an issue with an enhancement label, and I will do my best to implement it!_


### Swipe Gestures
One-finger and two-finger swipe gesture support that can call any Home Assistant action.
- Swiping anywhere on the center of the card will trigger a left, right, up, or down action based on the direction you swiped
   - Swiping from right to left calls the defined `Swipe Left Action`
   - Swiping from left to right calls the defined `Swipe Right Action`
   - Swiping from top to bottom calls the defined `Swipe Down Action`
   - Swiping from bottom to top calls the defined `Swipe Up Action`

### Center Tap Action
Tapping anywhere on the card that is not a button will call the defined `Touchpad Tap Action`; any Home Assistant action is supported.  At this time, this does not support any button design configurations or hold behavior actions.

### Buttons
16 configurable buttons that can call any Home Assistant action.
- Ability to add both a tap behavior and hold behavior action
- Ability to repeat an action on button hold with custom `Hold repeat delay` between 100 and 2000 milliseconds
- Buttons can be positioned anywhere on the card using the `Vertical adjustment` and `Horizontal adjustment` configs, but default to the outer edges
- Button location config format is *container*\_button_ *position*
   - `Top Button (Middle)` is the top _container's_ middle button, which is the power button in the example picture
   - `Right Button (Top)` is the right _container's_ top button, which is the volume up button in the example picture
   - `Corner Button (Top Right)` is the corner _container's_ top left button, which would be above the volume up button in the example picture 

### Background Cover Art
Dynamic or static cover art for the card background.
- From a `media_player` entity with a `entity_picture` attribute
- From any entity's custom state attribute
- From an internal home assistant URL by providing only the path
- From an external URL by providing the full URL with the path
- Change CSS properties background-size, background-position, background-repeat, as well as lighten or darken the image to make buttons easier to see

## Installation
### Installation and tracking with `HACS`

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Tjstock&repository=swipe-navigation-card&category=lovelace)

1. Make sure the [HACS](https://github.com/custom-components/hacs) component is installed and working.
2. Search for `swipe-navigation-card` and add it through HACS
3. Refresh home-assistant.
4. Add a manual card configuration to your lovelace dashboard and add the yaml configuration. See the configuration section below for more info.

> Note: If you are using YAML mode for your lovelace configuration, review [these instructions](https://www.home-assistant.io/dashboards/dashboards/#using-yaml-for-the-overview-dashboard) to include external resources.

### Manual
For a more in depth guide on how to install custom plugins outside of HACS please see this [guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

1. Download the swipe-navigation-card.js file
2. Place the file in your `config/www` folder
3. Include the card in your dashboard resources

   ```yaml
   resources:
     - url: /local/swipe-navigation-card.js
       type: js
   ```

4. Add a manual card configuration to your lovelace dashboard and add the yaml configuration. See the configuration section below for more info.

## Configuration
⭐Now has a fully functional graphical editor with section layout sizing support!⭐

### Swipe Gestures
![Card Example](/exampleimages/SwipeGesturesConfig.png)
| Name                   | Type                | Default      | Supported options              | Description                                                                                         |
|------------------------|---------------------|--------------|--------------------------------|-----------------------------------------------------------------------------------------------------|
| `swip_actions`         | Object              | none         | See Example                    | Parent Object for all swipe actions                                                                 |
| `one_finger`           | Object              | none         | See Example                    | Object to define the one-finger swipe left, right, up, down actions                                 |
| `two_finger`           | Object              | none         | See Example                    | Object to define the two-finger swipe left, right, up, down actions                                 |
| `tap_action`           | Object              | none         | See Example                    | Object to define the tap behaviour action (but really for a swipe action in this case)              |
| `tap_entity`           | String              | none         | Any Entity ID                  | If using the 'Toggle' or 'More info' behavior for a tap action, this field is required. For all other behaviors, leave this blank. |
| `swipe_left`           | Object              | none         | See Example                    | Object to define the action for left swipe gesture                                                  |
| `swipe_right`          | Object              | none         | See Example                    | Object to define the action for right swipe gesture                                                 |
| `swipe_up`             | Object              | none         | See Example                    | Object to define the action for up swipe gesture                                                    |
| `swipe_down`           | Object              | none         | See Example                    | Object to define the action for down swipe gesture                                                  |

```yaml
type: custom:swipe-navigation-card
swipe_actions:
  one_finger:
    swipe_left:
      tap_action:
        action: perform-action
        perform_action: remote.send_command
        target:
          entity_id: remote.harmony_hub
        data:
          device: Xbox
          command: DirectionLeft
  two_finger:
    swipe_up:
      tap_action:
        action: perform-action
        perform_action: remote.send_command
        target:
          entity_id: remote.harmony_hub
        data:
          device: Receiver
          command: VolumeUp
```

### Buttons
![Card Example](/exampleimages/ButtonsConfig.png)
| Name                        | Type                | Default      | Supported options              | Description                                                                                         |
|-----------------------------|---------------------|--------------|--------------------------------|-----------------------------------------------------------------------------------------------------|
| `default_icon_size`         | Number              | none         | Any Positive Number            | Default size of all the buttons. If not set, icons will autosize as card layout size changes        |
| `grid_gap`                  | Number              | none / 0     | Any Positive Number            | Pushes the buttons closer to the cards edge                                                         |
| `touchpad_tap_action`       | Object              | none         | See Example                    | Object to define what action to take when you tap the card anywhere there is not a button           |
| `top_button_left`           | Object              | none         | See Example                    | Object to define the action for the top container left button                                       |
| `top_button_middle`         | Object              | none         | See Example                    | Object to define the action for the top container middle button                                     |
| `top_button_right`          | Object              | none         | See Example                    | Object to define the action for the top container right button                                      |
| `bottom_button_left`        | Object              | none         | See Example                    | Object to define the action for the bottom container left button                                    |
| `bottom_button_middle`      | Object              | none         | See Example                    | Object to define the action for the bottom container middle button                                  |
| `bottom_button_right`       | Object              | none         | See Example                    | Object to define the action for the bottom container right button                                   |
| `left_button_top`           | Object              | none         | See Example                    | Object to define the action for the left container top button                                       |
| `left_button_middle`        | Object              | none         | See Example                    | Object to define the action for the left container middle button                                    |
| `left_button_bottom`        | Object              | none         | See Example                    | Object to define the action for the left container bottom button                                    |
| `right_button_top`          | Object              | none         | See Example                    | Object to define the action for the right container top button                                      |
| `right_button_middle`       | Object              | none         | See Example                    | Object to define the action for the right container middle button                                   |
| `right_button_bottom`       | Object              | none         | See Example                    | Object to define the action for the right container bottom button                                   |
| `corner_button_top_left`    | Object              | none         | See Example                    | Object to define the action for the corner top left button                                          |
| `corner_button_top_right`   | Object              | none         | See Example                    | Object to define the action for the corner top right button                                         |
| `corner_button_bottom_left` | Object              | none         | See Example                    | Object to define the action for the corner bottom left                                              |
| `corner_button_bottom_right`| Object              | none         | See Example                    | Object to define the action for the corner bottom right button                                      |
| `tap_action`                | Object              | none         | See Example                    | Object to define the tap behaviour action                                                           |
| `hold_action`               | Object              | none         | See Example                    | Object to define the hold behaviour action<br><br> _*Not supported for touchpad_tap_action_              |
| `hold_repeat_ms`            | Number              | none         | 100 - 2000                     | Delay in milliseconds between repeat actions upon holding the button.<br><br> A Hold action behavior of 'Nothing' will use the configured Tap action if this value is set, otherwise it will use the Hold action defined<br><br> _Configuring the 'Repeats', 'Delay Seconds', or 'Hold Seconds' config for a remote action may create unintended functionality if this config is also set<br><br>*Not supported for touchpad_tap_action_|
| `icon`                      | String              | none         | Any MDI                        | MDI to set for the Button                                                                           |
| `icon_color`                | String              | none         | Any CSS color (RGB list)       | Color of the Button                                                                                 |
| `icon_size`                 | Number              | none         | Any Positive Number            | Overide default size for the individual button                                                      |
| `vertical_adjustment`       | String              | none / 0     | Any Number                     | Vertically adjust the individual button on the card                                                 |
| `horizontal_adjustment`     | Number              | none / 0     | Any Number                     | Horizontally adjust the individual button on the card                                               |
| `tap_entity`                | String              | none         | Any Entity ID                  | If using the 'Toggle' or 'More info' behavior for a tap action, this field is required. For all other behaviors, leave this blank. |
| `hold_entity`               | String              | none         | Any Entity ID                  | If using the 'Toggle' or 'More info' behavior for a hold action, this field is required. For all other behaviors, leave this blank.|

```yaml
type: custom:swipe-navigation-card
button_actions:
  grid_gap: 25
  default_icon_size: 50
  touchpad_tap_action:
    tap_action:
      action: perform-action
      perform_action: remote.send_command
      target:
        entity_id: remote. harmony_hub
      data:
        device: Xbox
        command: OK
  top_button_right:
    icon: mdi:microsoft-xbox-controller-menu
    icon_color:
      - 236
      - 219
      - 51
    icon_size: 48
    vertical_adjustment: -25
    horizontal_adjustment: 40
    tap_action:
      action: perform-action
      perform_action: remote.send_command
      target:
        entity_id: remote.harmony_hub
      data:
        device: Xbox
        command: Menu
    hold_action:
      action: more-info
    hold_entity: switch.harmony_activity_xbox
  right_button_top:
    icon: mdi:volume-plus
    tap_action:
      action: perform-action
      perform_action: remote.send_command
      target:
        entity_id: remote.harmony_hub
      data:
        device: Receiver
        command: VolumeUp
    hold_repeat_ms: 250
  right_button_top:
    icon: mdi:volume-plus
    hold_repeat_ms: 250
    hold_action:
      action: perform-action
      perform_action: remote.send_command
      target:
        entity_id: remote.harmony_hub
      data:
        device: Receiver
        command: VolumeUp
```

### Background Cover Art
![Card Example](/exampleimages/CoverArtConfig.png)
| Name                        | Type     | Default           | Supported options     | Description                                                                                         |
|-----------------------------|----------|-------------------|-----------------------|-----------------------------------------------------------------------------------------------------|
| `background_cover_art`      | Object   | none              | See Example           | Dynamically updates cards background with chosen cover art                                          |
| `entity`                    | String   | none              | Any Entity ID         | Dynamically updates cards background with chosen cover art                                          |
| `state_attribute_name`      | Object   | `entity_picture`  | See Example           | Dynamically updates cards background with multiple ways to configure image url)                     |
| `internal_url_path`         | Object   | none              | See Example           | internal_url_path: /local/images/orange_img.png                                                     |
| `external_full_url`         | Object   | none              | See Example           | external_full_url: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png             |
| `background_css_config`     | Object   | none              | See Example           | Styling for the background image                                                                    |
| `position`                  | String   | `center`          | See CSS Documentation | `background-position` CSS property                                                                  |
| `size`                      | String   | `cover`           | See CSS Documentation | `background-size` CSS property                                                                      |
| `repeat`                    | String   | `no-repeat`       | See CSS Documentation | `background-repeat` CSS property                                                                    |
| `lighten_darken`            | String   | `no-repeat`       | See CSS Documentation | Lighten or darken the background image to make buttons easier to see                                |

![Card Example](/exampleimages/CoverArtExample1.png)

Media Player:
```yaml
type: custom:swipe-navigation-card
background_cover_art:
  entity: media_player.spotify
  style:
    size: 50%
    position: center
    repeat: no-repeat
    lighten_darken: 0
```

Custom State Attribute:
```yaml
type: custom:swipe-navigation-card
background_cover_art:
  entity: sensor.genius_lyrics_foobar_lyrics
  state_attribute_name: media_image
```

Internal Url Path:
```yaml
type: custom:swipe-navigation-card
background_cover_art:
  internal_url_path: /local/images/my_image.jpg
```

External Full Url:
```yaml
type: custom:swipe-navigation-card
background_cover_art:
  external_full_url: https://www.someurl.com/assets/img/custom_images/orange_img.png
```
