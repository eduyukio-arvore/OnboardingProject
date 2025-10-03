import * as hz from 'horizon/core';
import { PlayerDataManager } from './PlayerDataManager';

class Door extends hz.Component<typeof Door> {
  static propsDefinition = {
    doorParentEntity: { type: hz.PropTypes.Entity },
    openingSpeed: { type: hz.PropTypes.Number, default: 50.0 },
  };

  private isAnimating: boolean = false;
  private isOpen: boolean = false;
  private isLocked: boolean = true;
  private startRotation: number = 0;
  private finalRotation: number = 0;
  private animationDuration: number = 0;
  private startTime: number = 0;
  private maxOpeningAngle: number = 90;
  private updateIntervalTickSec: number = 0.02;

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (player: hz.Player) => {
        this.onPlayerTriggeredDoor(player);
      },
    );

    this.async.setInterval(() => {
      this.updateDoorState();
    }, this.updateIntervalTickSec * 1000);
  }

  /**
   * Updates the door state, running the opening/closing animation if it's needed
   */
  private updateDoorState() {
    if (this.isAnimating) {
      this.animateDoor();
    }
  }

  /**
   * Callback function that is called when the player interacts with the door's trigger zone.
   * It opens the door if it's closed, and closes the door if it's open.
   * @param player The player that interacted with the door.
   */
  private onPlayerTriggeredDoor(player: hz.Player) {
    console.log('[Door] onPlayerTriggeredDoor');

    if (this.isAnimating) return;
    if (this.isLocked) {
      let playerHasKey: boolean = PlayerDataManager.instance.playerHasKey(player);
      if (playerHasKey) {
        this.isLocked = false;
        this.world.ui.showPopupForPlayer(player, 'Door unlocked.', 2);
        //TODO: REMOVER OBJETO DA CHAVE
      } else {
        this.world.ui.showPopupForPlayer(player, 'The door is locked.', 2);
        return;
      }
    }

    this.startRotation = this.isOpen ? this.maxOpeningAngle : 0;
    this.finalRotation = this.isOpen ? 0 : this.maxOpeningAngle;
    this.animationDuration = this.maxOpeningAngle / this.props.openingSpeed;

    this.startTime = Date.now();
    this.isAnimating = true;
  }

  /**
   * Animates the door when it is opening or closing.
   */
  private animateDoor() {
    if (!this.props.doorParentEntity) {
      console.error('[Door] Door Parent reference missing.');
      return;
    }

    if (this.animationDuration <= 0) {
      console.error('[Door] The door animation duration must be positive.');
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
    let newQuaternionRotation = hz.Quaternion.fromEuler(newEulerRotation);

    this.props.doorParentEntity.rotation.set(newQuaternionRotation);
  }
}

hz.Component.register(Door);
