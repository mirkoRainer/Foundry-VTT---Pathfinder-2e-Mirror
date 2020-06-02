const newActivation = {
    cost: {
        value: 'A',
        specificAction: {
            value: ''
        },
    },
    components: [],
    trigger: {
        value: ''
    },
    frequency: {
        value: '',
        custom: {
            value: ''
        }
    },
    requirements: {
        value: ''
    },
    onset: {
        value: ''
    },
    effect: {
        value: ''
    }
};

export function createNewActivation() {
    return JSON.parse(JSON.stringify(newActivation));
}