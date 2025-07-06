export const CONTROLLER_VALUES = {
  A: 0x0080,
  B: 0x8000,
  X: 0x0040,
  Y: 0x4000,
  Select: 0x2000,
  L: 0x0020,
  R: 0x0010,
}

export const getControllerValue = (input: ControllerInput) => {
  return CONTROLLER_VALUES[input];
}

export const ControllerInputs = ["A", "B", "X", "Y", "Select", "L", "R"] as const;
export type ControllerInput = typeof ControllerInputs[number];

// These mappings are used to set the default controller mappings.
// The address is a PC address and not LO-ROM address.
export const ControllerMapping = {
  Shot: {
    originAddress: 0x81B331,
    pcAddress: 0x00B331,
    default: CONTROLLER_VALUES.X,
  },
  Jump: {
    originAddress: 0x81B325,
    pcAddress: 0x00B325,
    default: CONTROLLER_VALUES.A,
  },
  Dash: {
    originAddress: 0x81B32B,
    pcAddress: 0x00B32B,
    default: CONTROLLER_VALUES.B,
  },
  ItemSelect: {
    originAddress: 0x81B33D,
    pcAddress: 0x00B33D,
    default: CONTROLLER_VALUES.Select,
  },
  ItemCancel: {
    originAddress: 0x81B337,
    pcAddress: 0x00B337,
    default: CONTROLLER_VALUES.Y,
  },
  AngleUp: {
    originAddress: 0x81B343,
    pcAddress: 0x00B343,
    default: CONTROLLER_VALUES.R,
  },
  AngleDown: {
    originAddress: 0x81B349,
    pcAddress: 0x00B349,
    default: CONTROLLER_VALUES.L,
  },
};
