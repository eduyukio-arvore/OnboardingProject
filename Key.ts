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

  private onKeyGrabbed(isRightHand: boolean, player: hz.Player) {
    console.log('PLAYER GRABBED KEY');
    PlayerDataManager.instance.setPlayerHasKey(player, true);
  }
  private onKeyDropped(player: hz.Player) {
    console.log('PLAYER DROPPED KEY');
    PlayerDataManager.instance.setPlayerHasKey(player, false);
  }
}

hz.Component.register(Key);

