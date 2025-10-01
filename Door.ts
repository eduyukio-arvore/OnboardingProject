import * as hz from 'horizon/core';

class Door extends hz.Component<typeof Door> {
  static propsDefinition = {
    doorParentEntity: { type: hz.PropTypes.Entity },
    triggerEntity: { type: hz.PropTypes.Entity },
    openingSpeed: { type: hz.PropTypes.Number, default: 50.0 },
  };

  private isAnimating = false;
  private isOpen = false;
  private startRotation = 0;
  private finalRotation = 0;
  private animationDuration = 0;
  private startTime = 0;

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => {
      this.onPlayerTriggeredDoor();
    });

    this.connectLocalBroadcastEvent(hz.World.onUpdate, () => {
      this.updateDoorState();
    });
  }

  private updateDoorState() {
    if (this.isAnimating) {
      this.animateDoor();
    }
  }

  private onPlayerTriggeredDoor() {
    console.log('onPlayerTriggeredDoor');

    //TODO: fazer a porta poder ser interagida no meio da animação
    if (this.isAnimating) return;

    this.startRotation = this.isOpen ? 90 : 0;
    this.finalRotation = this.isOpen ? 0 : 90;
    this.animationDuration = 90 / this.props.openingSpeed;
    console.log(this.animationDuration);

    this.startTime = Date.now();
    this.isAnimating = true;
  }

  private animateDoor() {
    console.log('animateDoor');

    if (this.animationDuration <= 0) {
      return;
    }

    const elapsedTime = (Date.now() - this.startTime) / 1000;
    let animationProgressFraction = elapsedTime / this.animationDuration;

    let isAnimationFinished = animationProgressFraction >= this.animationDuration;
    if (isAnimationFinished) {
      this.isAnimating = false;
      this.isOpen = !this.isOpen;
      return;
    }

    const startRotation = new hz.Vec3(0, this.startRotation, 0);
    const endRotation = new hz.Vec3(0, this.finalRotation, 0);
    let newEulerRotation = hz.Vec3.lerp(startRotation, endRotation, animationProgressFraction);
    let newQuaternion = hz.Quaternion.fromEuler(newEulerRotation);
    this.props.doorParentEntity!.rotation.set(newQuaternion);
  }
}

hz.Component.register(Door);

