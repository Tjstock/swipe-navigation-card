[!["GitHub Release"](https://img.shields.io/github/v/release/tjstock/swipe-navigation-card.svg?style=for-the-badge)](https://github.com/Tjstock/swipe-navigation-card/releases)
[!["Community Forum"](https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge)](https://community.home-assistant.io/t/swipe-navigation-remote-card/729641)

# swipe-navigation-card
A card that allows you to control your media devices by using swipe gestures and buttons.

![Card Example](/exampleimages/example-card.png)
## Features
Please let me know of any new features that you would like to have! These actions can be configured to call any service.
- Swiping anywhere on the center of the card will trigger a left, right, up, or down action based on the direction you swiped.
   - Swiping from right to left triggers the `swipe_left` action.
   - Swiping from left to right triggers the `swipe_right` action.
   - Swiping from top to bottom triggers the `swipe_down` action.
   - Swiping from bottom to top triggers the `swipe_up` action.
- Clicking anywhere on the center of the card will trigger the `tap action` which I use as the 'A', 'OK', or 'Select' buttons.
- 12 configurable Buttons that can be used for 'Power', 'Menu', 'Rewind', 'Play/Pause', 'Fast Forward', 'Volume Up', 'Volume Down', 'Volume Mute', etc.
   - Button location config format is *container*\_button_ *position*.
      - `top_button_middle` is the top container's middle button which is the power button in the example picture.
      - `right_button_top` is the right container's top button which is the volume up button in the example picture.
   - You are not required to configure all of these buttons. If you don't want one of them to appear, just don't add the configuration for it.
- Ability to repeat actions on button hold. Currently configured to repeat every 250ms. Will add config property if requested.
- Dynamic Cover art for card background
  - From a `media_player` entity with a `entity_picture` attribute
  - From any entity's custom state attribute
  - From an internal home assistant URL by providing only the path
  - From an external URL by providing the full URL with the path


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
| Name                   | Type                | Default      | Supported options              | Description                                                                                         |
|------------------------|---------------------|--------------|--------------------------------|-----------------------------------------------------------------------------------------------------|
| `type`                 | String              | **Required** | `custom:swipe-navigation-card` | Type of the card                                                                                    |
| `swipe_left`           | Swipe Object        | **Required** | See Example                    | Object to define the action for left swipe gesture                                                  |
| `swipe_right`          | Swipe Object        | **Required** | See Example                    | Object to define the action for right swipe gesture                                                 |
| `swipe_up`             | Swipe Object        | **Required** | See Example                    | Object to define the action for up swipe gesture                                                    |
| `swipe_down`           | Swipe Object        | **Required** | See Example                    | Object to define the action for down swipe gesture                                                  |
| `two_finger_swipe_left`| Swipe Object        | none         | See Example                    | Object to define the action for two finger left swipe gesture                                       |
| `two_finger_swipe_right`| Swipe Object       | none         | See Example                    | Object to define the action for two finger right swipe gesture                                      |
| `two_finger_swipe_up`  | Swipe Object        | none         | See Example                    | Object to define the action for two finger up swipe gesture                                         |
| `two_finger_swipe_down`| Swipe Object        | none         | See Example                    | Object to define the action for two finger down swipe gesture                                       |
| `tap_action`           | Tap Object          | **Required** | See Example                    | Defines what action to take when you tap the card anywhere there is not a button                    |
| `top_button_left`      | Button Object       | none         | See Example                    | Object to define the action for the top left button                                                 |
| `top_button_middle`    | Button Object       | none         | See Example                    | Object to define the action for the top middle button                                               |
| `top_button_right`     | Button Object       | none         | See Example                    | Object to define the action for the top right button                                                |
| `bottom_button_left`   | Button Object       | none         | See Example                    | Object to define the action for the bottom left button                                              |
| `bottom_button_middle` | Button Object       | none         | See Example                    | Object to define the action for the bottom middle button                                            |
| `bottom_button_right`  | Button Object       | none         | See Example                    | Object to define the action for the bottom right button                                             |
| `left_button_top`      | Button Object       | none         | See Example                    | Object to define the action for the left top button                                                 |
| `left_button_middle`   | Button Object       | none         | See Example                    | Object to define the action for the left middle button                                              |
| `left_button_bottom`   | Button Object       | none         | See Example                    | Object to define the action for the left bottom button                                              |
| `right_button_top`     | Button Object       | none         | See Example                    | Object to define the action for the right top button                                                |
| `right_button_middle`  | Button Object       | none         | See Example                    | Object to define the action for the right middle button                                             |
| `right_button_bottom`  | Button Object       | none         | See Example                    | Object to define the action for the right bottom button                                             |
| `hold_repeat_enabled`  | Boolean             | false        | `true` or `false`              | Defines if the hold action should be enabled for a Button Object                                    |
| `icon`                 | String              | none         | Any MDI                        | MDI to set for the Button                                                                           |
| `color`                | String              | none         | Any CSS color                  | Color of the Button                                                                                 |
| `size`                 | String              | 48px         | Any Pixel Size                 | Size of the Button                                                                                  |
| `service`              | String              | **Required** | Any Service                    | Service to call for the button/gesture (e.g. `remote.send_command`, `media_player.volume_up`, etc.) |
| `data`                 | Service Data Object | **Required** | Any Service Data               | Service data to include for the button/gesture (e.g. `entity_id: media_player.receiver`)            |
| `background_cover_art` | Background Object   | none           | See Example        | Dynamically updates cards background with chosen cover art                                                    |
| `state_attribute_name` | Background Object Child | `entity_picture`  | See Example           | Dynamically updates cards background with multiple ways to configure image url)                     |
| `internal_url_path`    | Background Object Child | none              | See Example           | internal_url_path: /local/images/orange_img.png                                                     |
| `external_full_url`    | Background Object Child | none              | See Example           | external_full_url: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png             |
| `style`                | Background Object Child | none              | See Example           | Supports Background Style Configurations: position, size, and repeat.                               |
| `position`             | Style Object Child      | `center`          | See CSS Documentation | background-position CSS property                                                                    |
| `size`                 | Style Object Child      | `cover`           | See CSS Documentation | background-size CSS property                                                                        |
| `repeat`               | Style Object Child      | `repeat`          | See CSS Documentation | background-repeat CSS property                                                                      |





### Example
Currently, the `tap action` and all `swipe action` configurations are required, but I will remove this requirement if requested.

```yaml
type: custom:swipe-navigation-card
haptic: light
swipe_left:
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: LEFT
swipe_right:
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: RIGHT
swipe_up:
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: UP
swipe_down:
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: DOWN
tap_action:
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: ENTER
two_finger_swipe_left:
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: BACK
two_finger_swipe_right:
  service: media_player.media_play_pause
  data:
    entity_id: media_player.living_room_tv
two_finger_swipe_up:
  service: media_player.volume_up
  data:
    entity_id: media_player.living_room_tv
two_finger_swipe_down:
  service: media_player.volume_down
  data:
    entity_id: media_player.living_room_tv
top_button_left:
  icon: mdi:menu
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: MENU
top_button_middle:
  icon: mdi:power
  service: media_player.toggle
  data:
    entity_id: media_player.living_room_tv
top_button_right:
  icon: mdi:apps
  service: androidtv.adb_command
  data:
    entity_id: media_player.android_tv
    command: HOME
bottom_button_left:
  icon: mdi:rewind
  color: '#BABABA'
  service: androidtv.adb_command
  data:
    entity_id: media_player.android_tv
    command: REWIND
bottom_button_middle:
  icon: mdi:play-pause
  service: media_player.media_play_pause
  data:
    entity_id: media_player.living_room_tv
bottom_button_right:
  icon: mdi:fast-forward
  color: '#BABABA'
  service: androidtv.adb_command
  data:
    entity_id: media_player.android_tv
    command: FAST_FORWARD
left_button_top:
  icon: mdi:arrow-left
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: BACK
left_button_middle:
  icon: mdi:netflix
  color: '#E50914'
  service: media_player.select_source
  data:
    source: Netflix
    entity_id: media_player.android_tv
left_button_bottom:
  icon: mdi:hulu
  color: '#66aa33'
  service: media_player.select_source
  data:
    source: Hulu
    entity_id: media_player.android_tv
right_button_top:
  icon: mdi:volume-plus
  service: media_player.volume_up
  hold_repeat_enabled: true
  data:
    entity_id: media_player.living_room_tv
right_button_middle:
  icon: mdi:volume-mute
  color: red
  service: webostv.button
  data:
    entity_id: media_player.living_room_tv
    button: MUTE
right_button_bottom:
  icon: mdi:volume-minus
  hold_repeat_enabled: true
  service: media_player.volume_down
  data:
    entity_id: media_player.living_room_tv
background_cover_art:
  entity_id: media_player.spotify
  state_attribute_name:
  external_full_url:
  internal_url_path:
  style:
    position:
    size:
    repeat:
```
### Background Cover Art Example Configurations:

Basic Media Player Configuration:

![Card Example](/exampleimages/CoverArtExample1.png)
```yaml
background_cover_art:
  entity_id: media_player.spotify
```

Custom State Attribute Configuration with CSS:

![Card Example](/exampleimages/CoverArtExample2.png)
```yaml
background_cover_art:
  entity_id: sensor.genius_lyrics_foobar_lyrics
  state_attribute_name: media_image
  style:
    position: center
    size: 50%
    repeat: no-repeat
```

Internal Url Path Configuration with CSS:

![Card Example](/exampleimages/CoverArtExample3.png)
```yaml
background_cover_art:
  internal_url_path: /local/images/my_image.jpg
  style:
    position: center
    size: 70%
    repeat: no-repeat
```

External Full Url Configuration with CSS:

![Card Example](/exampleimages/CoverArtExample4.png)
```yaml
background_cover_art:
  external_full_url: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
  style:
    position: top
    size: 50%
```
### Love the card?
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/tjstock)
