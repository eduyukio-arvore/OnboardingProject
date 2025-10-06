import * as hz from 'horizon/core';

type LocalTransfer = {
  pickedUp: number
}

export const ON_INPUT = new hz.NetworkEvent<{player: hz.Player, input: hz.PlayerInputAction}>('nOnInput');

class Local extends hz.Component<typeof Local> {
  static propsDefinition = {
    trigger: {type: hz.PropTypes.Entity}
  };

  owner!: hz.Player;
  pickedUp = 0;

  input!: hz.PlayerInput;

  preStart(): void {
    this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      this.entity.owner.set(player);
    });
  }

  start() {
    this.owner = this.world.getLocalPlayer();
    const serverPlayer = this.world.getServerPlayer();
    const isServer = this.owner.id === serverPlayer.id;
    console.log(`Owner is ${isServer? 'Server' : this.owner.name.get()}`);

    if(isServer) return;

    this.connectInput();
  }

  transferOwnership(_oldOwner: hz.Player, _newOwner: hz.Player): LocalTransfer {
    console.log(`Transfering ownership to ${_newOwner.name.get()}`);
    
    this.disconnectInput();

    return {
      pickedUp: this.pickedUp
    };
  }

  receiveOwnership(_serializableState: LocalTransfer, _oldOwner: hz.Player, _newOwner: hz.Player): void {
    console.log(`Receive ownership called on ${_newOwner.name.get()}`);
    this.pickedUp = _serializableState.pickedUp;
    this.pickedUp++;
    console.log(`Picked up = ${this.pickedUp}`);
  }

  connectInput() {
    this.input = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftSecondary, hz.ButtonIcon.Heal, this, {
      customAssetIconId: '2291238074661892',
      preferredButtonPlacement: hz.ButtonPlacement.Center
    });

    this.input.registerCallback((action, pressed) => this.onInput(action, pressed));
  }

  disconnectInput(){
    if(!this.input) return;

    this.input.unregisterCallback();
    this.input.disconnect();
  }

  onInput(action: hz.PlayerInputAction, isPressed: boolean) {
    if(action !== hz.PlayerInputAction.LeftSecondary || !isPressed) {
      return;
    }

    console.log(`Input pressed!`);
    this.sendNetworkBroadcastEvent(ON_INPUT, {
      player: this.owner, input: hz.PlayerInputAction.LeftSecondary
    });
  }
}
hz.Component.register(Local);