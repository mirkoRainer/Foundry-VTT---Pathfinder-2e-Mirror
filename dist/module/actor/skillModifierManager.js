class SkillModifierManager {
  constructor(actorSheet) {
    this.actorSheet = actorSheet;
  }

  createStatModifier(ev) {
    ev.preventDefault();
    console.log('Creating stat modifier');
  }

  bindEvents(html) {
    html.find('a.add-stat-modifier').click(this.createStatModifier);
  }
}

export default SkillModifierManager;
