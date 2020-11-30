# xbox-swipe-navigation-card
This card imitates the Xbox app's swipe gesture remote by integrating the basic buttons and swipe gestures to control the navigation using touch or mouse events.

Currently this card is not very customizable or universal but if requested I can work on improving it.

![Card Example](card-example.png)

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
| `hold_repeat_enabled`| boolean| false | `true` \| `false` | Defines if the hold action should be enabled. Only available for the volume_up and volume_down buttons|
| `service`| string| **Required** | Any service | Service to call (e.g. remote.send_command, media_player.volume_up, etc.)|
| `data`| object| **Required** | Any service data | Service data to include (e.g. entity_id: media_player.receiver)|

### Example
Although no config validations exist, currently all `swipe_actions` and `button_actions` configurations are required but may become optional in the future.

NOTE: Using the new [Xbox Integration](https://www.home-assistant.io/integrations/xbox/) will work perfect. I was using a harmony hub before the integration came out.

```
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
