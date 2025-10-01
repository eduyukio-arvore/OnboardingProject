import { Component, PropTypes, Vec3, World } from 'horizon/core';

class MovingPlatform extends Component<typeof MovingPlatform> {
  static propsDefinition = {
    startPosition: { type: PropTypes.Vec3, default: new Vec3(0, 0, 0) },
    endPosition: { type: PropTypes.Vec3, default: new Vec3(0, 0, 10) },
    speed: { type: PropTypes.Number, default: 1.0 },
  };

  private isMovingToEnd = true;
  private journeyLength = 0;
  private startTime = 0;

  override start() {
    this.journeyLength = this.props.startPosition.distance(this.props.endPosition);
    this.startTime = Date.now();
    this.entity.position.set(this.props.startPosition);

    this.connectLocalBroadcastEvent(World.onUpdate, () => {
      this.updateMovement();
    });
  }

  private updateMovement() {
    if (this.journeyLength <= 0) {
      return;
    }

    const journeyTime = this.journeyLength / this.props.speed;
    const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
    let fractionOfJourney = elapsedTime / journeyTime;

    if (fractionOfJourney >= 1) {
      fractionOfJourney = 1;
      this.isMovingToEnd = !this.isMovingToEnd;
      this.startTime = Date.now();
    }

    const start = this.isMovingToEnd ? this.props.startPosition : this.props.endPosition;
    const end = this.isMovingToEnd ? this.props.endPosition : this.props.startPosition;

    const newPosition = Vec3.lerp(start, end, fractionOfJourney);
    this.entity.position.set(newPosition);
  }
}

Component.register(MovingPlatform);