class SkillModifierManager {
  constructor(actorSheet) {
    this.actorSheet = actorSheet;
  }

  createStatModifier(ev) {
    ev.preventDefault();
    console.log('Creating stat modifier');
  }

  editModifier(ev) {
    ev.preventDefault();
    console.log('Editing Modifier');
    console.log(this);
  }

  bindEvents(html) {
    html.find('a.add-stat-modifier').click(this.createStatModifier.bind(this));
    html.find('a.edit-modifier').click(this.editModifier.bind(this));
  }
}

export default SkillModifierManager;
