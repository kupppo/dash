import { Item, ItemNames } from "./items";

class Loadout {
  ammo = {
    missilePacks: 0,
    superPacks: 0,
    powerPacks: 0,
  }
  tanks = {
    energyTanks: 0,
    reserveTanks: 0,
  }
  inventory = [];

  constructor(inventory, ammo, tanks) {
    this.inventory = inventory;
    this.ammo = ammo;
    this.tanks = tanks;
  }

  has(itemType) {
    return this.inventory.includes(itemType);
  }

  canDestroyBombWalls() {
    return this.canPassBombPassages() || this.has(Item.ScrewAttack)
  }

  canFly() {
    return this.canUseBombs() || this.has(Item.SpaceJump);
  }

  canUseBombs() {
    return this.has(Item.Bombs) && this.has(Item.Morph)
  }

  canUsePowerBombs() {
    return this.ammo.powerPacks > 0 && this.has(Item.Morph)
  }

  canPassBombPassages() {
    return this.canUseBombs() || this.canUsePowerBombs()
  }

  canOpenGreenDoors() {
    return this.ammo.superPacks > 0
  }

  canOpenRedDoors() {
    return this.ammo.missilePacks > 0 || this.ammo.superPacks > 0
  }

  canOpenYellowDoors() {
    return this.ammo.powerPacks > 0 && this.canUsePowerBombs()
  }

  canCrystalFlash() {
    return (
      this.canUsePowerBombs() &&
      this.ammo.missilePacks >= 2 &&
      this.ammo.superPacks >= 2 &&
      this.ammo.powerPacks >= 3
    )
  }

  totalTanks() {
    return this.tanks.energyTanks + this.tanks.reserveTanks
  }

  clone() {
    return new Loadout(this.inventory, this.ammo, this.tanks)
  }

  add(itemType) {
    switch (itemType) {
      case Item.Bombs:
      case Item.Morph:
      case Item.Gravity:
      case Item.PressureValve:
      case Item.HeatShield:
      case Item.Varia:
      case Item.HJB:
      case Item.DoubleJump:
      case Item.SpaceJump:
      case Item.ScrewAttack:
      case Item.SpringBall:
      case Item.Speed:
      case Item.Ice:
      case Item.Wave:
      case Item.Charge:
      case Item.Spazer:
      case Item.Plasma:
      case Item.Grapple:
      case Item.BeamUpgrade:
      case Item.Xray:
        this.inventory.push(itemType);
        break;
      case Item.Missile:
        this.ammo.missilePacks += 1;
        break;
      case Item.Super:
        this.ammo.superPacks += 1;
        break;
      case Item.PowerBomb:
        this.ammo.powerPacks += 1;
        break;
      case Item.EnergyTank:
        this.tanks.energyTanks += 1;
        break;
      case Item.Reserve:
        this.tanks.reserveTanks += 1;
        break;
      default:
        console.error("[Loadout] Unknown item type:", ItemNames.get(itemType));
        break;
    }
  }
}

export default Loadout;
