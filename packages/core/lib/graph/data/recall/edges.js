//-----------------------------------------------------------------
// Edge definitions.
//-----------------------------------------------------------------

const WreckedShip_Bowling_Missiles_to_Reserve = {
  edges: ["Missiles (Bowling)", "Reserve Tank (Wrecked Ship)"],
  requires: () => CanUsePowerBombs,
};

const WreckedShip_RearExit_to_WSHighway = {
  edges: ["ShipRearExit", "Door_WSHighway"],
  requires: () => CanMoveInWestMaridia,
};

const WestMaridia_MainStreet_to_AboveMaridiaMap = {
  edges: ["MainStreet", "AboveMaridiaMap"],
  // Removes the requirement for supers to open the green gate
  requires: () => CanOpenRedDoors,
};

const WestMaridia_AboveMaridiaMap_to_MainStreet = {
  edges: ["AboveMaridiaMap", "MainStreet"],
  // Removes the requirement for supers to green gate glitch
  requires: true,
};

const EastMaridia_OasisBottom_to_SpringBall = {
  edges: ["OasisBottom", "Spring Ball"],
  requires: () => CanMoveInWestMaridia && CanUsePowerBombs,
};

const EastMaridia_PlasmaSparkRoomTop_to_PrePlasmaBeam = {
  edges: ["PlasmaSparkRoomTop", "PrePlasmaBeam"],
  requires: true,
};

const EastMaridia_PlasmaBeam_to_PrePlasmaBeam = {
  edges: ["Plasma Beam", "PrePlasmaBeam"],
  requires: true,
};

const EastMaridia_BotwoonHallway_Left_to_Right = {
  edges: ["BotwoonHallwayLeft", "BotwoonHallwayRight"],
  requires: () => (HasGravity && HasSpeed) || HasIce || HasSpazer,
};

const GreenBrinstar_ChargeBeam_to_Waterway = {
  edges: ["Charge Beam", "Energy Tank (Waterway)"],
  requires: () =>
    CanUsePowerBombs && CanOpenRedDoors && (HasSpeed || HasSpazer),
};

const UpperNorfair_PreCrocomire_to_CrocEntry = {
  edges: ["PreCrocomire", "Door_CrocEntry"],
  requires: true,
};

//-----------------------------------------------------------------
// Exports.
//-----------------------------------------------------------------

export const RecallEdgeUpdates = [
  WreckedShip_Bowling_Missiles_to_Reserve,
  WreckedShip_RearExit_to_WSHighway,
  WestMaridia_MainStreet_to_AboveMaridiaMap,
  WestMaridia_AboveMaridiaMap_to_MainStreet,
  EastMaridia_OasisBottom_to_SpringBall,
  EastMaridia_PlasmaBeam_to_PrePlasmaBeam,
  EastMaridia_PlasmaSparkRoomTop_to_PrePlasmaBeam,
  GreenBrinstar_ChargeBeam_to_Waterway,
  EastMaridia_BotwoonHallway_Left_to_Right,
  UpperNorfair_PreCrocomire_to_CrocEntry,
];
