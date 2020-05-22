import { weightToBulk, toBulkItems, calculateBulk, formatBulk, Bulk } from './bulk.js';
import { groupBy } from '../utils.js';

function getHeldItems(id, items = []) {
    return items.filter(item => item?.data?.containerId?.value === id);
}

export class Container {
    constructor(item, heldItems, negateBulk, capacity, heldItemBulk, isInContainer, formattedNegateBulk, formattedHeldItemBulk, formattedCapacity) {
        this.item = item;
        this.heldItems = heldItems;
        this.negateBulk = negateBulk;
        this.heldItemBulk = heldItemBulk;
        this.isInContainer = isInContainer;
        this.formattedHeldItemBulk = formattedHeldItemBulk;
        this.formattedNegateBulk = formattedNegateBulk;
        this.formattedCapacity = formattedCapacity;
        this.capacity = capacity;
    }
    
    get isContainer() {
        return !this.capacity.isNegligible;
    }

    get isNotInContainer() {
        return !this.isInContainer;
    }
}

function getContainerWeight(item, items, stackDefinitions, bulkConfig) {
    const heldItems = getHeldItems(item._id, items);
    console.log(heldItems)
    const bulkItems = toBulkItems(heldItems);
    console.log(bulkItems)
    throw new Error("hi")
    return calculateBulk(bulkItems, stackDefinitions, false, bulkConfig)[0];
}

function getNegateBulk(item) {
    const negateBulk = item.data?.negateBulk?.value;
    return weightToBulk(negateBulk) ?? new Bulk();
}

function getCapacity(item) {
    const bulkCapacity = item.data?.bulkCapacity?.value;
    return weightToBulk(bulkCapacity) ?? new Bulk();
}

function toContainer(item, heldItems = [], isInContainer, stackDefinitions, bulkConfig) {
    const negateBulk = getNegateBulk(item);
    const heldItemBulk = getContainerWeight(item, heldItems, stackDefinitions, bulkConfig);
    const maximumBulk = getCapacity(item);
    return new Container(
        item, 
        heldItems,
        negateBulk,
        maximumBulk,
        heldItemBulk,
        isInContainer,
        formatBulk(negateBulk),
        formatBulk(heldItemBulk),
        formatBulk(maximumBulk),
    )
}

export function getContainerMap(items = [], stackDefinitions, bulkConfig) {
    const allIds = groupBy(items, item => item._id);
    
    const containerGroups = groupBy(items, item => {
        const containerId = item?.data?.containerId?.value;
        if (allIds.has(containerId)) {
            return containerId;
        }
        return null;
    });
    
    const containerData = new Map();
    items
        .map(item => {
            const itemId = item._id;
            const isInContainer = containerGroups.has(item?.data?.containerId?.value);
            if (containerGroups.has(itemId)) {
                return [itemId, containerGroups.get(itemId), isInContainer];
            }
            return [itemId, [], isInContainer];
        })
        .forEach(([id, heldItems, isInContainer]) => {
            containerData.set(id, toContainer(
                allIds.get(id)[0], 
                heldItems,
                isInContainer, 
                stackDefinitions, 
                bulkConfig
            ));    
        })
    
    return containerData;
}
