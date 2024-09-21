import { expect, test } from 'vitest';
import BoxPokemon from '../src/BoxPokemon';

const testBuffer = 'd2,27,ac,e0,80,26,82,06,d0,bf,c8,cf,cd,bb,cf,cc,ff,00,02,02,c7,d5,ed,ff,e3,e6,ff,00,6f,1f,00,00,52,59,ab,44,6f,41,0d,d5,52,81,2e,e6,51,01,2e,e6,46,2d,3e,e6,ad,47,2e,e6,1d,01,c5,e6,1b,01,65,e6,4a,09,3e,ce,4b,2e,67,a2,5e,18,2e,e6,52,01,2e,e6';

// bytes contain a Venusaur in a plain pokeball that is level 100
// and has 1059860 experience
const testBytes = testBuffer.split(",").map((b) => parseInt(b, 16));

// leaving it empty because we aren't going to test indexes
const testIndexes = [];

test('Test pokemon has 1059860 experience', () => {
  const testPokemon = new BoxPokemon(testBytes.slice(), testIndexes.slice());
  const exp = Number(testPokemon.getExperiencePoints());
  expect(exp).toBe(1059860);
});

test('Changing personality value does not effect EVs, IVs, or moveset', () => {
  const testPokemon = new BoxPokemon(testBytes.slice(), testIndexes.slice());
  testPokemon.setIndividualValues([31, 31, 31, 31, 31, 31]);
  testPokemon.setEffortValues([0, 0, 0, 0, 0, 0]);

  // Change personality value...
  const newPersonalityValue = testPokemon.getPersonalityValue() - 1n;
  testPokemon.setPersonalityValue(newPersonalityValue);

  const {
    hp,
    attack,
    defense,
    speed,
    specialAttack,
    specialDefense
  } = testPokemon.getIndividualValues();

  expect(hp).toBe(31);
  expect(attack).toBe(31);
  expect(defense).toBe(31);
  expect(speed).toBe(31);
  expect(specialAttack).toBe(31);
  expect(specialDefense).toBe(31);

  const {
    hp: hp2,
    attack: attack2,
    defense: defense2,
    speed: speed2,
    specialAttack: specialAttack2,
    specialDefense: specialDefense2,
  } = testPokemon.getEffortValues();

  expect(hp2).toBe(0);
  expect(attack2).toBe(0);
  expect(defense2).toBe(0);
  expect(speed2).toBe(0);
  expect(specialAttack2).toBe(0);
  expect(specialDefense2).toBe(0);

});
