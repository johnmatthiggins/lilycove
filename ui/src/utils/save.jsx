import { findBitVector } from './hex.jsx';

// This is what it looks like when it starts at zero.
// The first time the game is saved, the save counter
// goes to 1 and it gets shifted from this to having
// pc_buffer_I at the front.
const DEFAULT_SAVE_BLOCK_SECTION_ORDER = [
  "trainer_info",
  "team_and_items",
  "game_state",
  "misc_data",
  "rival_info",
  "pc_buffer_A",
  "pc_buffer_B",
  "pc_buffer_C",
  "pc_buffer_D",
  "pc_buffer_E",
  "pc_buffer_F",
  "pc_buffer_G",
  "pc_buffer_H",
  "pc_buffer_I",
];

const SAVE_BLOCK_SECTION_COUNT = DEFAULT_SAVE_BLOCK_SECTION_ORDER.length;

const SAVE_BLOCK_SECTION_SIZES = {
  "trainer_info": 0xF2C,
  "team_and_items": 0xF80,
  "game_state": 0xF80,
  "misc_data": 0xF80,
  "rival_info": 0xF08,
  "pc_buffer_A": 0xF80,
  "pc_buffer_B": 0xF80,
  "pc_buffer_C": 0xF80,
  "pc_buffer_D": 0xF80,
  "pc_buffer_E": 0xF80,
  "pc_buffer_F": 0xF80,
  "pc_buffer_G": 0xF80,
  "pc_buffer_H": 0xF80,
  "pc_buffer_I": 0x7D0,
};

MAGIC_BITS = [0x08, 0x01, 0x20, 0x25];

function _asUint32(bytes) {
  if (bytes.length === 4) {
    return new Uint32Array(bytes)[0];
  }
  return null;
}

// write function that finds most recent save block

function findSectionAddreses(bits, saveBlockOffset) {
  const blockSize = 0xE000;

  // carve out bits for desired save block...
  const blockBits = bits.slice(
    saveBlockOffset,
    saveBlockOffset + blockSize
  );

  const [magicAddress] = findBitVector(blockBits, MAGIC_BITS);
  const saveCounterAddress = magicAddress + 0x4;
  const saveCounter = _asUint32(
    blockBits.slice(saveCounterAddress, saveCounterAddress + 0x4)
  );

  const shiftCount = saveCounter % SAVE_BLOCK_SECTION_COUNT;

  const currentOrdering = barrelShiftRight(DEFAULT_SAVE_BLOCK_SECTION_ORDER, shiftCount);
  const offsets = {};
  let currentAddress = 0x0;

  for (let i = 0; i < currentOrdering.length; i += 1) {
    const sectionName = currentOrdering[i];
    offsets[sectionName] = currentAddress;

    // add offset to next section...
    currentAddress += SAVE_BLOCK_SECTION_SIZES[sectionName];
  }

  return offsets;
}

export default {
  findSectionAddreses,
};
