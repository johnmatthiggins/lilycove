import { expect, test } from 'vitest';
import BoxPokemon from '../src/BoxPokemon';

const testBuffer = 'd2,27,ac,e0,80,26,82,06,d0,bf,c8,cf,cd,bb,cf,cc,ff,00,02,02,c7,d5,ed,ff,e3,e6,ff,00,6f,1f,00,00,52,59,ab,44,6f,41,0d,d5,52,81,2e,e6,51,01,2e,e6,46,2d,3e,e6,ad,47,2e,e6,1d,01,c5,e6,1b,01,65,e6,4a,09,3e,ce,4b,2e,67,a2,5e,18,2e,e6,52,01,2e,e6';

// bytes contain a Venusaur in a plain pokeball that is level 100
// and has 1059860 experience
const testBytes = testBuffer.split(",").map((b) => parseInt(b, 16));

// leaving it empty because we aren't going to test indexes
const testIndexes = [];

test('Test pokemon has 1059860 experience', () => {
  const testPokemon = BoxPokemon(testBytes, testIndexes);
  const exp = Number(testPokemon.getExperiencePoints());
  expect(exp).toBe(1059860);
});
