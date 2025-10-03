import * as hz from 'horizon/core';
import { PlayerDataManager } from './PlayerDataManager';

class Key extends hz.Component<typeof Key> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnGrabStart,
      (isRightHand: boolean, player: hz.Player) => {
        this.onKeyGrabbed(isRightHand, player);
      },
    );

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player: hz.Player) => {
      this.onKeyDropped(player);
    });
  }

  /**
   * Callback function that is called when the player grabs the key.
   * It sets on the PlayerDataManager that this player has a key.
   * @param player The player that interacted with the Key.
   */
  private onKeyGrabbed(isRightHand: boolean, player: hz.Player) {
    console.log('PLAYER GRABBED KEY');
    PlayerDataManager.instance.setPlayerHasKey(player, true);
  }

  /**
   * Callback function that is called when the player drops the key.
   * It sets on the PlayerDataManager that this player don't have key.
   * @param player The player that interacted with the Key.
   */
  private onKeyDropped(player: hz.Player) {
    console.log('PLAYER DROPPED KEY');
    PlayerDataManager.instance.setPlayerHasKey(player, false);
  }
}

hz.Component.register(Key);

