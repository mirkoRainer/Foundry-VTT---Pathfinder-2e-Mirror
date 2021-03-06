declare interface UserActivityData {
    /** The coordinates of the user's cursor */
    cursor: any;
    /** Is the user pulling focus to the cursor coordinates? */
    focus: boolean;
    /** Is the user emitting a ping at the cursor coordinates? */
    ping: boolean;
    /** Serialized Ruler coordinate data in JSON format */
    ruler: string;
    /** The id of the Scene currently being viewed by the User */
    sceneId: string;
    /** An id of Token ids which are targeted by the User */
    targets: any[];
}

/**
 * The collection of User entities which is accessible through ``game.users``.
 * The array of User entities within this collection is accessible through ``game.users.entities``.
 */
declare class Users<ActorType extends Actor = Actor> extends Collection<User<ActorType>> {
    entities: User<ActorType>[];

    /**
     * Elements of the Users collection are instances of the User class
     */
    get object(): User<ActorType>;

    /**
     * Get the users with player roles
     */
    get players(): User<ActorType>[];

    values(): IterableIterator<User<ActorType>>;

    /* -------------------------------------------- */
    /*  Socket Listeners and Handlers               */
    /* -------------------------------------------- */

    /**
     * Handle receipt of activity data from another User connected to the Game session
     * @param userId		The User id who generated the activity data
     * @param activityData	The object of activity data
     */
    static _handleUserActivity(userId: string, activityData?: object): void;
}

declare interface UserData extends BaseEntityData {
    type: string;
    color: string;
}

/**
 * The User entity
 * Each player who connects to a Foundry Virtual Tabletop session is a User.
 * Users represent human beings (or possibly programmatic players) and are the cornerstone of identity in Foundry VTT.
 *
 * @param data				The source data for the User entity, usually retrieved from the database.
 * @param data._id			The Entity ID, automatically generated by the Database when a new User is created.
 * @param data.password		An access key for the Entity.
 * @param data.role			The role level for the User, from CONST.USER_ROLES
 * @param data.permissions	An object of key-value permissions for the User which extend the default functionality
 *							of the User's role.
 * @param data.avatar		A web-accessible file path to an avatar image used to represent the User.
 * @param data.character	The _id of the Actor entity that the User has chosen as their primary character.
 * @param data.color		A color string which represents the visual color associated with this particular User.
 * @param data.flags		A free-form object of key-value pairs which allows modules and systems the ability
 *							to store arbitrary data as part of the User object.
 * @param options			Initialization options which modify the construction of a User entity. See the Entity
 *							class for more detail.
 */
declare class User<ActorType extends Actor = Actor> extends Entity {
    data: UserData;
    /**
     * Track whether the user is currently active in the game
     */
    active: boolean;

    /**
     * Track references to the current set of Tokens which are targeted by the User
     */
    targets: Set<Token>;

    /**
     * Track the ID of the Scene that is currently being viewed by the User
     */
    viewedScene: string;

    /** @override */
    static get config(): {
        baseEntity: User;
        collection: Users;
        embeddedEntities: {};
    };

    /**
     * Return the User avatar icon or the controlled actor's image
     */
    get avatar(): string;

    /**
     * Return the Actor instance of the user's impersonated character (or undefined)
     */
    get character(): ActorType | undefined;

    /**
     * @override
     * @deprecated
     */
    get permission(): number;

    /**
     * A convenience shortcut for the permissions object of the current User
     * @type {Object}
     */
    get permissions(): any;

    /**
     * A flag for whether the current User is a Trusted Player
     */
    get isTrusted(): boolean;

    /**
     * A flag for whether the current User has Assistant GameMaster or full GameMaster role
     */
    get isGM(): boolean;

    /**
     * A flag for whether this User is the connected client
     */
    get isSelf(): boolean;

    /* ---------------------------------------- */
    /*  User Methods                            */
    /* ---------------------------------------- */

    /**
     * Test whether the User is able to perform a certain permission action. Game Master users are always allowed to
     * perform every action, regardless of permissions.
     *
     * @param permission	The action to test
     */
    // can(permission: string): boolean;

    /**
     * Test whether the User has a specific permission entitled .This differs from user#can because it does not always
     * return true for Game Master users and should be used in cases where a permission could be withheld even from
     * a GM player (for example cursor display, or A/V audio).
     *
     * @param permission	The action to test
     * @return				Does the user have explicit permission to perform this action?
     */
    hasPermission(permission: string): boolean;

    /**
     * Test whether the User has at least the permission level of a certain role
     * @param role	The role name from USER_ROLES to test
     * @return		Does the user have at least this role level?
     */
    hasRole(role: string | number): boolean;

    /**
     * Test whether the User has exactly the permission level of a certain role
     * @param role	The role name from USER_ROLES to test
     * @return		Does the user have exactly this role level?
     */
    isRole(role: string | number): boolean;

    /**
     * Sets a user's permission
     * Modifies the user permissions to grant or restrict access to a feature.
     *
     * @param permission	The permission name from USER_PERMISSIONS
     * @param allowed		Whether to allow or restrict the permission
     */
    setPermission(permission: string, allowed: boolean): void;

    /**
     * Submit User activity data to the server for broadcast to other players.
     * This type of data is transient, persisting only for the duration of the session and not saved to any database.
     *
     * @param activityData			An object of User activity data to submit to the server for broadcast.
     * @param activityData.cursor	The coordinates of the user's cursor
     * @param activityData.focus	Is the user pulling focus to the cursor coordinates?
     * @param activityData.ping		Is the user emitting a ping at the cursor coordinates?
     * @param activityData.ruler	Serialized Ruler coordinate data in JSON format
     * @param activityData.sceneId	The id of the Scene currently being viewed by the User
     * @param activityData.targets	An id of Token ids which are targeted by the User
     */
    broadCastActivity(activityData?: UserActivityData): void;

    /**
     * Assign a Macro to a numbered hotbar slot between 1 and 50
     * @param {Macro|null} macro  The Macro entity to assign
     * @param {number} slot       The integer Hotbar slot to fill
     * @param {number} [fromSlot] An optional origin slot from which the Macro is being shifted
     * @return {Promise}          A Promise which resolves once the User update is complete
     */
    assignHotbarMacro(macro: Macro | null, slot: number, { fromSlot }?: { fromSlot?: number }): Promise<User>;

    /**
     * Get an Array of Macro Entities on this User's Hotbar by page
     * @param page	The hotbar page number
     */
    getHotbarMacros(page?: number): Macro[];

    updateTokenTargets(targetIds: any): void;

    /* -------------------------------------------- */
    /*  Socket Listeners and Handlers               */
    /* -------------------------------------------- */

    /**
     * Additional updating steps for the User entity when new data is saved which trigger some related updates.
     *
     * Re-draw the active cursor and toggle visibility
     * Re-draw navigation if the active or viewed scenes have changed
     * Render the players UI if activity status or other player features have changed
     * Update the canvas if the player's impersonated character has changed
     */
    protected _onUpdate(data: object, options: object, userId: string, context: object): void;
}
