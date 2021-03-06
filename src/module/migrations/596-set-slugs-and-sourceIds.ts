import { MigrationBase } from './base';
import { ItemData } from '../item/dataDefinitions';
import { PF2EItem } from '../item/item';
import { PF2EPhysicalItem } from '../item/physical';

type ItemMap = Map<string, PF2EItem>;
type PackContent = Map<string, Promise<ItemMap>>;

export class Migration596SetSlugSourceIds extends MigrationBase {
    static version = 0.596;

    /** Only PF2e system compendia will be checked against */
    private sourceIdPattern = /^Compendium\.(pf2e\.[-\w]+)\.(\w+)$/;

    private readonly itemPacks: Map<string, Compendium<PF2EItem>>;

    /** Cached compendium content */
    private static packContent: PackContent = new Map();

    constructor() {
        super();
        this.itemPacks = new Map(
            game.packs.filter<PF2EItem>((pack) => pack.entity === 'Item').map((pack) => [pack.collection, pack]),
        );
    }

    private getPackContent(collection: string): Promise<ItemMap> {
        const cache = Migration596SetSlugSourceIds.packContent;

        console.debug(`Loading pack ${collection}`);

        const cacheAndRelease = (): Promise<ItemMap> => {
            // Cache on first retrieval
            const pack = this.itemPacks.get(collection);
            if (pack === undefined) {
                throw Error('PF2e System | Expected error retrieving compendium');
            }

            // Make all item updates wait for this content retrieval to resolve
            const promisedItems = (async () => {
                const newContent = await pack.getContent();
                const itemMap = new Map(newContent.map((item) => [item.id, item]));
                return itemMap;
            })();
            cache.set(collection, promisedItems);

            return promisedItems;
        };

        return cache.get(collection) ?? cacheAndRelease();
    }

    /** Look through each pack and attempt to find the originating item */
    private async findCompendiumItem(ownedItem: PF2EItem, collection?: string): Promise<PF2EItem | undefined> {
        const itemName =
            ownedItem instanceof PF2EPhysicalItem && !ownedItem.isIdentified
                ? ownedItem.data.data.identification?.identified?.name || ownedItem.name
                : ownedItem.name;

        const packs = typeof collection === 'string' ? [this.itemPacks.get(collection)] : this.itemPacks.values();

        for await (const pack of packs) {
            if (pack === undefined) continue;
            const content = await this.getPackContent(pack.collection);
            const packItem = Array.from(content.values()).find(
                (packItem) => packItem.type === ownedItem.type && packItem.name === itemName,
            );

            if (packItem instanceof PF2EItem) {
                return packItem;
            }
        }

        return undefined;
    }

    async updateItem(itemData: ItemData): Promise<void> {
        const item = new PF2EItem(itemData);
        const existingSourceId: string | undefined = item.getFlag('core', 'sourceId');
        const match = this.sourceIdPattern.exec(existingSourceId ?? '');
        const collection = Array.isArray(match) ? match[1] : undefined;

        const sourcedItem = [collection, item.slug].every((maybeString) => typeof maybeString === 'string')
            ? item
            : await this.findCompendiumItem(item, collection);

        if (sourcedItem instanceof PF2EItem) {
            console.debug(`PF2e System | Setting slug and sourceId for ${item.name}`);
            const sourceId = sourcedItem.getFlag('core', 'sourceId');
            itemData.data.slug = sourcedItem.slug;
            itemData.flags.core = { sourceId: sourceId };
        }
    }
}
