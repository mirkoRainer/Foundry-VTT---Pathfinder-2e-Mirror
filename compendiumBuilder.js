const fs = require('fs-extra');
const path = require('path');

module.exports = class CompendiumBuilder {
  constructor(compendiumDirectory) {
    this.compendiumDirectory = compendiumDirectory;
  }

  get compendiumFiles() {
    return fs.readdirSync(this.compendiumDirectory).filter((el) => { return el.endsWith(".json") })
  }

  get compendiumElements() {
    if(this._compendiumElements) return this._compendiumElements;
    const reducer = (acc, file) => {
      const compendiumObjects = JSON.parse(fs.readFileSync(path.join(this.compendiumDirectory, file)))
      if((compendiumObjects instanceof Array)) return acc.concat(compendiumObjects)
      return acc.concat([compendiumObjects]);
    }
    this._compendiumElements = this.compendiumFiles.reduce(reducer, [])
    return this._compendiumElements
  }

  get compendiumContent() {
    return this.compendiumElements.map((element) => {
      return JSON.stringify(element, null, 0)
    }).join("\n")
  }
}

// export default CompendiumBuilder
