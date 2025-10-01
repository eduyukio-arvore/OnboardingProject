import * as hz from 'horizon/core';

class Key extends hz.Component<typeof Key> {
  static propsDefinition = {};

  start() {
    const owner = this.entity.owner.get();

    if (owner === this.world.getServerPlayer()) {
      console.log('Script owned by Server Player');
    } else {
      this.connectCodeBlockEvent(
        this.entity,
        hz.CodeBlockEvents.OnGrabStart,
        this.onWeaponGrabbed.bind(this),
      );

      this.connectCodeBlockEvent(
        this.entity,
        hz.CodeBlockEvents.OnGrabEnd,
        this.onWeaponDropped.bind(this),
      );
    }
  }

  private onWeaponGrabbed(isRightHand: boolean, player: hz.Player) {
    console.log('PLAYER GRABBED KEY');
  }
  private onWeaponDropped(player: hz.Player) {
    console.log('PLAYER DROPPED KEY');
  }
}

hz.Component.register(Key);

