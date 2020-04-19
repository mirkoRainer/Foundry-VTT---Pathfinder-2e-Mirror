class SkillModifier {
  static get defaults() {
    return {
      type: 'statModifier',
      data: {
        label: 'New Modifier',
        modifiers: [],
        multiplier: 1,
      },
    };
  }

  constructor(item, actor) {
    this.item = item || {};
    this.actor = actor;
    Object.assign(this, item.data || {});
  }

  get id() {
    return this.item._id;
  }

  setEnabled(enabled) {
    this.actor.updateEmbeddedEntity('OwnedItem', { _id: this.id, data: { enabled } });
  }

  setMultiplier(multiplier) {
    this.actor.updateEmbeddedEntity('OwnedItem', { _id: this.id, data: { multiplier } });
  }
}

export default SkillModifier;
