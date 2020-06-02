const newActivation = {
    activationCost: 'A',
    components: [],
    additionalActivationCost: {
        description: ''
    },
    trigger: {
        description: ''
    },
    requirements: {
        description: ''
    },
    onset: {
        description: ''
    },
    effect: {
        description: ''
    }
};

export function createNewActivation() {
    return JSON.parse(JSON.stringify(newActivation));
}