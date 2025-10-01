import * as hz from 'horizon/core';

class Door extends hz.Component<typeof Door> {
  static propsDefinition = {
    doorParentEntity: { type: hz.PropTypes.Entity },
    triggerEntity: { type: hz.PropTypes.Entity },
    openingSpeed: { type: hz.PropTypes.Number, default: 1.0 },
  };

  private canOpenDoor = false;
  private isOpening = false;
  private isOpen = false;
  private totalOpeningRotation = 0;
  private totalOpeningDuration = 0;
  private startTime = 0;

  start() {
    console.log('start');
    this.totalOpeningRotation = 90;
    this.totalOpeningDuration = this.totalOpeningRotation / this.props.openingSpeed;

    // this.addOpenDoorInput();

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => {
      this.isOpening = true;
      this.startTime = Date.now();

      //TODO: NO FUTURO ALTERAR PARA O CAN OPEN E LIDAR COM INPUT
      // this.canOpenDoor = true;
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, () => {
      this.canOpenDoor = false;
    });

    this.connectLocalBroadcastEvent(hz.World.onUpdate, () => {
      this.updateDoorState();
    });
  }

  private updateDoorState() {
    if (this.isOpen) return;

    if (this.isOpening) {
      this.openDoor();
    }
  }

  private openDoor() {
    console.log('open door');

    if (this.totalOpeningDuration <= 0) {
      return;
    }

    const elapsedTime = (Date.now() - this.startTime) / 1000;
    let openingProgressFraction = elapsedTime / this.totalOpeningDuration;
    console.log(openingProgressFraction);

    let doorFinishedOpening = openingProgressFraction >= 1;
    if (doorFinishedOpening) {
      this.isOpening = false;
      this.isOpen = true;
      return;
    }

    const startRotation = new hz.Vec3(0, 0, 0);
    const endRotation = new hz.Vec3(0, 90, 0);
    let newRotation = hz.Vec3.lerp(startRotation, endRotation, openingProgressFraction);
    let newQuaternion = hz.Quaternion.fromEuler(newRotation);
    this.props.doorParentEntity!.rotation.set(newQuaternion);
  }

  private addOpenDoorInput() {
    console.log('addOpenDoorInput');
    const playerInput = hz.PlayerControls.connectLocalInput(
      hz.PlayerInputAction.RightGrip,
      hz.ButtonIcon.Door,
      this,
    );

    playerInput.registerCallback((action, pressed) => {
      if (pressed && action == hz.PlayerInputAction.RightGrip) {
        // this.sendLocalEvent(this.Player, LocalEvents.OPEN_INVENTORY_UI, {});
        if (this.canOpenDoor) {
          this.isOpening = true;
          this.startTime = Date.now();
        }
      }
    });
  }
}

hz.Component.register(Door);

