import * as hz from 'horizon/core';

export class PlayerDataManager extends hz.Component<typeof PlayerDataManager> {
  public static instance: PlayerDataManager;

  private playerKeyStatus: Map<number, boolean> = new Map(); // <player.id, hasKey>

  constructor() {
    super();
    if (PlayerDataManager.instance) {
      console.error('[PlayerDataManager] Another instance of PlayerDataManager already exists!');
      return;
    }
    PlayerDataManager.instance = this;
  }

  start() {}

  /**
   * Sets whether a specific player has a key.
   * @param player The player whose key status is being set.
   * @param hasKey True if the player has a key, false otherwise.
   */
  public setPlayerHasKey(player: hz.Player, hasKey: boolean): void {
    this.playerKeyStatus.set(player.id, hasKey);
    console.log(`[PlayerDataManager] Player ${player.name.get()} key status set to: ${hasKey}`);
  }

  /**
   * Checks if a specific player has a key.
   * @param player The player to check.
   * @returns True if the player has the key, false otherwise.
   */
  public playerHasKey(player: hz.Player): boolean {
    return this.playerKeyStatus.get(player.id) || false;
  }
}

hz.Component.register(PlayerDataManager);

