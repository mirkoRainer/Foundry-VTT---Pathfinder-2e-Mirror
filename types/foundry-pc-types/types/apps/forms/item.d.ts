declare interface ItemSheetData<I extends Item> extends BaseEntitySheetData<I> {
    item?: I;
    data?: any;
}

/**
 * The default Item Sheet
 *
 * This Application is responsible for rendering an item's attributes and allowing the item to be edited.
 *
 * System modifications may elect to override this class to better suit their own game system by re-defining the value
 * ``CONFIG.Item.sheetClass``.
 *
 * @param item				The Item instance being displayed within the sheet.
 * @param options			Additional options which modify the rendering of the item.
 * @param options.editable	Is the item editable? Default is true.
 */
declare class ItemSheet<ItemType extends Item, ActorType extends Actor> extends BaseEntitySheet<ItemType> {
    /**
     * Assign the default options which are supported by this Application
     */
    static get defaultOptions(): FormApplicationOptions;

    /**
     * A convenience reference to the Item entity
     */
    get item(): ItemType;

    /**
     * The Actor instance which owns this item. This may be null if the item is unowned.
     */
    get actor(): ActorType;

    /**
     * Customize the data provided to the item sheet for rendering. By default we just duplicate the item data.
     */
    getData(): ItemSheetData<this['item']>;

    /**
     * Activate listeners which provide interactivity for item sheet events
     * @param html The HTML object returned by template rendering
     */
    protected activateListeners(html: JQuery): void;
}
