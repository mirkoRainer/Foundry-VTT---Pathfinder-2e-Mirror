import SkillModifier from './skillModifiers/skillModifier.js';

class SkillModifierManager {
  constructor(actorSheet) {
    this.actorSheet = actorSheet;
  }

  applyData(data) {
    data.statModifiers = [];
    for (const [idx, statModifier] of data.items.entries()) {
      if (statModifier.type === 'statModifier') {
        data.statModifiers.push(new SkillModifier(statModifier));
      }
    }
  }

  createStatModifier(ev) {
    ev.preventDefault();
    this.actor.createEmbeddedEntity('OwnedItem', SkillModifier.defaults);
  }

  editModifier(ev) {
    ev.preventDefault();
    console.log('Editing Modifier');
    console.log(this);
  }

  editMultiplier(ev) {
    ev.preventDefault();
    const itemId = this.fetchId(ev);
    const { target: { value: multiplier } } = ev;
    new SkillModifier({ _id: itemId }, this.actor).setMultiplier(multiplier);
  }

  toggleEnabled(ev) {
    ev.preventDefault();
    const itemId = this.fetchId(ev);
    const { target: { checked } } = ev;
    new SkillModifier({ _id: itemId }, this.actor).setEnabled(checked);
  }

  fetchId(ev) {
    return ev.target.closest('*[data-item-id]').dataset.itemId;
  }

  bindEvents(html) {
    html.find('a.add-stat-modifier').click(this.createStatModifier.bind(this));
    html.find('a.edit-modifier').click(this.editModifier.bind(this));
    html.find('.stat-modifiers input[data-target="multiplier"]').change(this.editMultiplier.bind(this));
    html.find('.stat-modifiers input[data-target="enabled"]').change(this.toggleEnabled.bind(this));
  }

  get actor() {
    return this.actorSheet.actor;
  }
}

export default SkillModifierManager;
