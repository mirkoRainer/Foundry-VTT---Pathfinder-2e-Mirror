const CompendiumBuilder = require('../compendiumBuilder.js');
import path from 'path';

describe('#compendiumFiles', () => {
  test('it returns all the JSON files in a compendium directory', () => {
    const compendiumBuilder = new CompendiumBuilder(path.resolve("tests", "fixtures", "compendium_examples", "items"));

    expect(compendiumBuilder.compendiumFiles).toEqual(["bracers_of_armor.json", "mistform_elixir.json"])
  });
});

describe('#compendiumElements', () => {
  test('it returns all the JSON elements in the directory combined into one array', () => {
    const compendiumBuilder = new CompendiumBuilder(path.resolve("tests", "fixtures", "compendium_examples", "items"));

    expect(compendiumBuilder.compendiumElements.length).toBe(3)
  })
});

describe('#compendiumContent', () => {
  test('it returns minified JSON for every item separated by newlines', () => {
    const compendiumBuilder = new CompendiumBuilder(path.resolve("tests", "fixtures", "compendium_examples", "items"));

    const compendiumContent = compendiumBuilder.compendiumContent;
    expect(compendiumContent.split("\n").length).toBe(3)
  })
});
