import SkillModifier from './skillModifiers/skillModifier.js';

class SkillModifierManager {
  constructor(actorSheet) {
    this.actorSheet = actorSheet;
  }

  applyData(data) {
    data.statModifiers = [];
    for (const [idx, statModifier] of data.items.entries()) {
      if (statModifier.type === 'statModifier') {
        data.statModifiers.push(statModifier);
      }
    }
  }

  createStatModifier(ev) {
    ev.preventDefault();
    const modifier = new SkillModifier();
    this.actor.createEmbeddedEntity('OwnedItem', modifier.toItem());
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
    this.actor.updateEmbeddedEntity('OwnedItem', { _id: itemId, data: { multiplier } });
  }

  toggleEnabled(ev) {
    ev.preventDefault();
    const itemId = this.fetchId(ev);
    const { target: { checked } } = ev;
    this.actor.updateEmbeddedEntity('OwnedItem', { _id: itemId, data: { enabled: checked } });
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
