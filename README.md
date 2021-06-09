# xbox-swipe-navigation-card
A card that allows you to control your xbox by using swipe gestures and buttons. This card is similar to the Xbox app's remote control.

![Card Example](card-example.png)
## Features
Please let me know of any new features that you would like to have! For example the ability to add Custom buttons, icons, styles, keyboard support etc.
- Swiping anywhere on the center of the card will trigger a left, right, up, or down action based on the direciton you swiped.
   - Swiping from right to left triggers the left action.
   - Swiping from left to right triggers the right action.
   - Swiping from top to bottom triggers the down action.
   - Swiping from bottom to top triggers the up action.
- Clicking anywhere on the center of the card will trigger the `touchpad` action which I use as the 'A', 'OK', or 'Select' button.
- Buttons for 'X', 'Y', 'B', 'View', 'Xbox', 'Menu', 'Rewind', 'Play/Pause', 'Fast Forward', 'Volume Up', 'Volume Down', 'Volume Mute'
- Ability to repeat actions on hold for the Volume Up and Volume Down buttons. Currently configured to repeat every 250ms. Will add config property if requested.


## Installation

1. Download the xbox-swipe-navigation-card.js file
2. Place the file in your `config/www` folder
3. Include the card code in your `ui-lovelace-card.yaml` resources section

   ```yaml
   title: Home
   resources:
     - url: /local/xbox-swipe-navigation-card.js
       type: js
   ```

4. Add configuration for the card in your `ui-lovelace.yaml`

## Configuration

| Name                  | Type            | Default      | Supported options                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------- | --------------- | ------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`                | string          | **Required** | `custom:xbox-swipe-navigation-card`                    | Type of the card |
| `swipe_actions`       | object          | **Required** |  See Example           | Object to define the actions for left, right, up and down swipe gestures |
| `button_actions`      | object          | **Required** | See Example       | Object to define the actions for `touchpad` (select, A, OK) and all other buttons  |
| `hold_repeat_enabled`| boolean| false | `true` \| `false` | Defines if the hold action should be enabled. Only available for the `volume_up` and `volume_down` buttons|
| `service`| string| **Required** | Any service | Service to call (e.g. `remote.send_command`, `media_player.volume_up`, etc.)|
| `data`| object| **Required** | Any service data | Service data to include (e.g. `entity_id: media_player.receiver`)|

### Example
Currently all `swipe_actions` and `button_actions` configurations are required but may become optional in the future.

NOTE: Using home assistants [Xbox Integration](https://www.home-assistant.io/integrations/xbox/) will also work! I was just using my harmony hub prior to integration's release.

```yaml
type: 'custom:xbox-swipe-navigation-card'
swipe_actions:
  left: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: DirectionLeft
  right: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: DirectionRight
  up: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: DirectionUp
  down:
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: DirectionDown
button_actions:
  touchpad: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: OK
  view: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: View
  xbox: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: Xbox
  menu: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: Menu
  rewind:
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: Rewind
  play_pause:
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: Play/Pause
  fast_forward:
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: FastForward
  b: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: B
  y: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: 'Y'
  x: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Xbox
      command: X
  volume_up: 
    service: media_player.volume_up
    hold_repeat_enabled: true
    data:
      entity_id: media_player.receiver
  volume_mute: 
    service: remote.send_command
    data:
      entity_id: remote.harmony_hub
      device: Receiver
      command: Mute
  volume_down: 
    service: media_player.volume_down
    hold_repeat_enabled: true
    data:
      entity_id: media_player.receiver
```
