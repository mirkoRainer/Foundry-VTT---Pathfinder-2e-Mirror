class SkillModifier {
  constructor() {
    this.label = 'New Modifier';
  }

  toItem() {
    return {
      type: 'statModifier',
      data: {
        label: this.label,
        modifiers: [],
        multiplier: 1,
      },
    };
  }
}

export default SkillModifier;
