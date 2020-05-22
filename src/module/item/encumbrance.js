export class InventoryWeight {
    constructor(combinedBulk, encumberedAt, limit) {
        this.combinedBulk = combinedBulk;
        this.encumberedAt = encumberedAt;
        this.limit = limit;
    }

    get encumberedPercentage() {
        const totalTimes10 = this.combinedBulk.toLightBulk();
        const encumberedAtTimes10 = this.encumberedAt * 10 + 10;
        return Math.floor((totalTimes10 / encumberedAtTimes10) * 100);
    }

    get limitPercentage() {
        const totalTimes10 = this.combinedBulk.toLightBulk();
        const limitTimes10 = this.limit * 10 + 10;
        return Math.floor((totalTimes10 / limitTimes10) * 100);
    }

    get limitPercentageMax100() {
        if (this.limitPercentage > 100) {
            return 100;
        }
        return this.limitPercentage;
    }

    get isEncumbered() {
        return this.combinedBulk.normal > this.encumberedAt;
    }

    get isOverLimit() {
        return this.combinedBulk.normal > this.limit;
    }

    get bulk() {
        return this.combinedBulk.normal;
    }
}

/**
 * @param strengthModifier
 * @param bonusBulkLimit in bulk
 * @param combinedBulk
 */
export function calculateEncumbrance(strengthModifier, bonusBulkLimit, combinedBulk) {
    const modifier = strengthModifier + bonusBulkLimit;
    const encumberedAt = modifier + 5;
    const limit = modifier + 10;
    return new InventoryWeight(combinedBulk, encumberedAt, limit);
}
