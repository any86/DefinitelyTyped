// This file exists solely to test whether or not the typings actually work.
// After working on your changes, make sure to run `npm run compile` to build
// the declarations before opening this file.
//
// If you open this file and see no red squiggly lines, then you're good!
// Feel free to add more test cases in the form of a sample code.

// TODO: add more test cases.

// Sample inputs

const creep: Creep = Game.creeps.sampleCreep;
const room: Room = Game.rooms.W10S10;
const flag: Flag = Game.flags.Flag1;
const powerCreep: PowerCreep = Game.powerCreeps.samplePowerCreep;
const spawn: StructureSpawn = Game.spawns.Spawn1;
const body: BodyPartConstant[] = [WORK, WORK, CARRY, MOVE];

// Sample inputs for Game.map.findRoute testing
const anotherRoomName: Room = Game.rooms.W10S11;

// Sample memory extensions
interface CreepMemory {
    sourceId: Id<Source>;
    lastHits: number;
}

// Typescript always uses 'string' as the type of a key inside 'for in' loops.
// In case of objects with a restricted set of properties (e.g. ResourceConstant as key in StoreDefinition)
// the type of the key should be narrowed down in order to prevent casting (key as ResourceConstant).
// This helper function provides strongly typed keys for such objects.
// See discussion (https://github.com/Microsoft/TypeScript/pull/12253) why Object.keys does not return typed keys.
function keys<T extends Record<string, any>>(o: T): Array<keyof T> {
    return Object.keys(o) as Array<keyof T>;
}

function resources(o: GenericStore): ResourceConstant[] {
    return Object.keys(o) as ResourceConstant[];
}

// Game object Id types
{
    const creepId: Id<Creep> = "1" as Id<Creep>;
    const creepOne: Creep | null = Game.getObjectById(creepId);
    const creepThree: Creep = new Creep(creepId); // Works with typed ID

    if (creepOne) {
        creepOne.hits;
        const recycle = Game.getObjectById(creepOne.id);
    }

    type StoreStructure = StructureContainer | StructureStorage | StructureLink;
    const storeUnionID: Id<StoreStructure> = "1234" as Id<StoreStructure>; // Strict assertion required
    const storeIdUnion: StoreStructure["id"] = "1234" as StoreStructure["id"];
    const stringID: string = storeUnionID; // Id<T> assignable implicitly to string
    const stringID2: string = storeIdUnion; // Id<T> assignable implicitly to string
    const storeObject = Game.getObjectById(storeUnionID)!;
    const storeObject2 = Game.getObjectById(storeIdUnion)!;

    // Object recognized
    switch (storeObject.structureType) {
        case STRUCTURE_CONTAINER:
            storeObject.structureType === "container";
        case STRUCTURE_STORAGE:
            storeObject.structureType === "storage";
        default:
            storeObject.structureType === "link";
    }
}

// Game.creeps

{
    for (const creepName of Object.keys(Game.creeps)) {
        Game.creeps[creepName].moveTo(flag);
    }
}

// Game.flags

{
    creep.moveTo(Game.flags.Flag1);
}

// Game.powerCreeps

{
    PowerCreep.create("steve", POWER_CLASS.OPERATOR) === OK;

    for (const i of Object.keys(Game.powerCreeps)) {
        const powerCreep = Game.powerCreeps[i];

        if (powerCreep.ticksToLive === undefined) {
            // Not spawned in world; spawn creep
            const spawn = Game.getObjectById("powerSpawnID" as Id<StructurePowerSpawn>)!;
            powerCreep.spawn(spawn);
        } else {
            // Generate Ops
            if (
                powerCreep.powers[PWR_GENERATE_OPS] &&
                powerCreep.powers[PWR_GENERATE_OPS].cooldown === 0 &&
                (powerCreep.carry.ops || 0) < 10
            ) {
                Game.powerCreeps[i].usePower(PWR_GENERATE_OPS);
            } else {
                // Boost resource
                const targetSource = Game.getObjectById("targetSourceID" as Id<Source>)!;
                const sourceEffect = targetSource.effects.find(effect => effect.effect === PWR_REGEN_SOURCE && effect.level > 0);
                if (!sourceEffect && powerCreep.powers[PWR_REGEN_SOURCE] && powerCreep.powers[PWR_REGEN_SOURCE].cooldown === 0) {
                    powerCreep.usePower(PWR_REGEN_SOURCE, targetSource);
                }
            }
        }

        // AnyCreep type checks
        creep.attack(powerCreep);
        creep.heal(powerCreep);
        creep.rangedAttack(powerCreep);
        creep.rangedHeal(powerCreep);
        creep.transfer(powerCreep, RESOURCE_ENERGY);
        powerCreep.transfer(creep, RESOURCE_ENERGY);

        // Upgrading
        powerCreep.upgrade(PWR_GENERATE_OPS);
    }

    const myPowaCreeps = Game.rooms.sim.find(FIND_MY_POWER_CREEPS);

    // Constant type checking
    POWER_INFO[PWR_GENERATE_OPS].className === POWER_CLASS.OPERATOR;
    typeof POWER_INFO[PWR_GENERATE_OPS].level[0] === "number";
}

// Game.spawns

{
    for (const i of Object.keys(Game.spawns)) {
        Game.spawns[i].createCreep(body);

        // Test StructureSpawn.Spawning
        const creep: Spawning | null = Game.spawns[i].spawning;
        if (creep) {
            const name: string = creep.name;
            const needTime: number = creep.needTime;
            const remainingTime: number = creep.remainingTime;
            const creepSpawn: StructureSpawn = creep.spawn;

            const cancelStatus: OK | ERR_NOT_OWNER = creep.cancel();
            const setDirectionStatus: OK | ERR_NOT_OWNER | ERR_INVALID_ARGS = creep.setDirections([TOP, BOTTOM, LEFT, RIGHT]);
        }

        const invaderCore = new StructureInvaderCore("" as Id<StructureInvaderCore>);
        const invader = invaderCore.spawning;
        if (invader) {
            const name = invader.name;
        }
    }
}

// Game.time

{
    let time = Game.time;
    time += 1;
}

// Game.cpu.getUsed()

{
    if (Game.cpu.getUsed() > Game.cpu.tickLimit / 2) {
        // Half CPU Usged
    }
}

{
    for (const name of Object.keys(Game.creeps)) {
        const startCpu = Game.cpu.getUsed();

        // creep logic goes here

        const elapsed = Game.cpu.getUsed() - startCpu;
    }
}

// Game.cpu.setShardLimits()

{
    Game.cpu.setShardLimits({ shard0: 20, shard1: 10 });
}

// Game.cpu.halt()
{
    if (Game.cpu.hasOwnProperty("halt")) {
        Game.cpu.halt!();
    }
}

// Game.cpu.unlock()
{
    if (!Game.cpu.unlocked) {
        if (!Game.cpu.unlockedTime) {
            const unlock_state = Game.cpu.unlock();
            if (unlock_state === OK) {
                // Unlimited cosmic power!
            }
        }
    }
}

// Game.getObjectById(id)

{
    creep.memory.sourceId = creep.pos.findClosestByRange(FIND_SOURCES)!.id;
    const source = Game.getObjectById<Source>(creep.memory.sourceId);
}

// Game.notify(message, [groupInterval])

{
    if (creep.hits < creep.memory.lastHits) {
        Game.notify(`Creep ${creep.toString()} has been attacked at ${creep.pos.toString()}!`);
    }
    creep.memory.lastHits = creep.hits;
}

{
    if (Game.spawns["Spawn1"].energy === 0) {
        Game.notify(
            "Spawn1 is out of energy",
            180, // group these notifications for 3 hours
        );
    }
}

// Game.map.describeExits()

{
    const exits = Game.map.describeExits("W8N3");
    // tslint:disable-next-line:newline-per-chained-call
    keys(exits).map(exitKey => {
        const nextRoom = exits[exitKey];
        const exitDir = +exitKey as ExitConstant;
        const exitPos = creep.pos.findClosestByRange(exitDir);
        return { nextRoom, exitPos };
    });
}

// Game.map.findExit()

{
    if (creep.room.name !== anotherRoomName.name) {
        const exitDir = Game.map.findExit(creep.room, anotherRoomName);
        if (exitDir !== ERR_NO_PATH && exitDir !== ERR_INVALID_ARGS) {
            const exit = creep.pos.findClosestByRange(exitDir);
            if (exit !== null) {
                creep.moveTo(exit);
            }
        }
    } else {
        // go to some place in another room
    }
}

{
    creep.moveTo(new RoomPosition(25, 25, anotherRoomName.name));
}

// Game.map.findRoute()

{
    const route = Game.map.findRoute(creep.room, anotherRoomName);

    if (route !== ERR_NO_PATH && route.length > 0) {
        const exit = creep.pos.findClosestByRange(route[0].exit);
        if (exit !== null) {
            creep.moveTo(exit);
        }
    }
}

{
    const route = Game.map.findRoute(creep.room, anotherRoomName, {
        routeCallback(roomName, fromRoomName) {
            if (roomName === "W10S10") {
                // avoid this room
                return Infinity;
            }
            return 1;
        },
    });
}

{
    const from = new RoomPosition(25, 25, "E1N1");
    const to = new RoomPosition(25, 25, "E4N1");

    // Use `findRoute` to calculate a high-level plan for this path,
    // prioritizing highways and owned rooms
    const allowedRooms = { [from.roomName]: true };
    const route = Game.map.findRoute(from.roomName, to.roomName, {
        routeCallback(roomName) {
            const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
            if (parsed !== null) {
                const isHighway = parseInt(parsed[1], 10) % 10 === 0 || parseInt(parsed[2], 10) % 10 === 0;
                const isMyRoom = Game.rooms[roomName] && Game.rooms[roomName].controller && Game.rooms[roomName].controller!.my;
                if (isHighway || isMyRoom) {
                    return 1;
                } else {
                    return 2.5;
                }
            } else {
                return 2.5;
            }
        },
    });

    if (route !== ERR_NO_PATH) {
        route.forEach(info => {
            allowedRooms[info.room] = true;
        });
    }

    // Invoke PathFinder, allowing access only to rooms from `findRoute`
    const ret = PathFinder.search(from, [to], {
        roomCallback: roomName => {
            if (allowedRooms[roomName] === undefined) {
                return false;
            } else {
                return true;
            }
        },
    });
}

// Game.map.getRoomLinearDistance(roomName1, roomName2, [continuous])

{
    Game.map.getRoomLinearDistance("W1N1", "W4N2"); // 3
    Game.map.getRoomLinearDistance("E65S55", "W65S55", false); // 131
    Game.map.getRoomLinearDistance("E65S55", "W65S55", true); // 11
}

// Game.map.getTerrainAt(x, y, roomName)
// Game.map.getTerrainAt(pos)

{
    Game.map.getTerrainAt(25, 20, "W10N10");
}

{
    Game.map.getTerrainAt(new RoomPosition(25, 20, "W10N10"));
}

// Game.map.getRoomStatus(roomName)

{
    const roomStatus = Game.map.getRoomStatus(room.name);
    if (roomStatus.status === "normal") {
        creep.moveTo(room.getPositionAt(25, 25)!);
    }
}

// Game.market

{
    // Game.market.calcTransactionCost(amount, roomName1, roomName2)
    const cost = Game.market.calcTransactionCost(1000, "W0N0", "W10N5");

    // Game.market.cancelOrder(orderId)
    for (const id of Object.keys(Game.market.orders)) {
        Game.market.cancelOrder(id);
    }

    // Game.market.changeOrderPrice(orderId, newPrice)
    Game.market.changeOrderPrice("57bec1bf77f4d17c4c011960", 9.95);

    // Game.market.createOrder({type, resourceType, price, totalAmount, [roomName]})
    Game.market.createOrder({ type: ORDER_SELL, resourceType: RESOURCE_GHODIUM, price: 9.95, totalAmount: 10000, roomName: "W1N1" });
    Game.market.createOrder({ type: ORDER_SELL, resourceType: RESOURCE_GHODIUM, price: 9.95, totalAmount: 10000 });

    // Game.market.deal(orderId, amount, [yourRoomName])
    Game.market.deal("57cd2b12cda69a004ae223a3", 1000, "W1N1");

    const amountToBuy = 2000;
    const maxTransferEnergyCost = 500;
    const orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: RESOURCE_GHODIUM });

    for (const i of orders) {
        if (i.roomName) {
            const transferEnergyCost = Game.market.calcTransactionCost(amountToBuy, "W1N1", i.roomName);

            if (transferEnergyCost < maxTransferEnergyCost) {
                Game.market.deal(i.id, amountToBuy, "W1N1");
                break;
            }
        }
    }

    // Game.market.extendOrder(orderId, addAmount)
    Game.market.extendOrder("57bec1bf77f4d17c4c011960", 10000);

    // Game.market.getAllOrders([filter])
    Game.market.getAllOrders();
    Game.market.getAllOrders({ type: ORDER_SELL, resourceType: RESOURCE_GHODIUM });

    const targetRoom = "W1N1";
    Game.market.getAllOrders(
        currentOrder =>
            currentOrder.resourceType === RESOURCE_GHODIUM &&
            currentOrder.type === ORDER_SELL &&
            Game.market.calcTransactionCost(1000, targetRoom, currentOrder.roomName!) < 500,
    );

    // Game.market.getOrderById(id)
    const order = Game.market.getOrderById("55c34a6b5be41a0a6e80c123");

    // Subscription tokens
    Game.market.getAllOrders({ type: ORDER_SELL, resourceType: SUBSCRIPTION_TOKEN });
    Game.market.createOrder({ type: ORDER_BUY, resourceType: SUBSCRIPTION_TOKEN, totalAmount: 10000000, price: 1 });

    const priceHistory = Game.market.getHistory(RESOURCE_FIXTURES);

    const avgPrice: number = priceHistory[0].avgPrice;
    const stddevPrice: number = priceHistory[0].stddevPrice;
    const volume: number = priceHistory[0].volume;

    // Game.market.getHistory([resourceType])
    const energyHistory = Game.market.getHistory(RESOURCE_ENERGY);
    const pixelHistory = Game.market.getHistory(PIXEL);
}

// PathFinder

{
    const pfCreep = Game.creeps.John;

    // tslint:disable-next-line:newline-per-chained-call
    const goals = pfCreep.room.find(FIND_SOURCES).map(source => {
        // We can't actually walk on sources-- set `range` to 1
        // so we path next to it.
        return { pos: source.pos, range: 1 };
    });

    const ret = PathFinder.search(pfCreep.pos, goals, {
        // We need to set the defaults costs higher so that we
        // can set the road cost lower in `roomCallback`
        plainCost: 2,
        swampCost: 10,

        roomCallback(roomName) {
            const curRoom = Game.rooms[roomName];
            // In this example `room` will always exist, but since
            // PathFinder supports searches which span multiple rooms
            // you should be careful!
            if (!curRoom) {
                return false;
            }
            const costs = new PathFinder.CostMatrix();

            // tslint:disable-next-line:newline-per-chained-call
            curRoom.find(FIND_STRUCTURES).forEach(struct => {
                if (struct.structureType === STRUCTURE_ROAD) {
                    // Favor roads over plain tiles
                    costs.set(struct.pos.x, struct.pos.y, 1);
                } else if (
                    struct.structureType !== STRUCTURE_CONTAINER &&
                    (struct.structureType !== STRUCTURE_RAMPART || !(struct as OwnedStructure).my)
                ) {
                    // Can't walk through non-walkable buildings
                    costs.set(struct.pos.x, struct.pos.y, 0xff);
                }
            });

            // Avoid creeps in the room
            // tslint:disable-next-line:newline-per-chained-call
            curRoom.find(FIND_CREEPS).forEach(thisCreep => {
                costs.set(thisCreep.pos.x, thisCreep.pos.y, 0xff);
            });

            return costs;
        },
    });

    const pos = ret.path[0];
    pfCreep.move(pfCreep.pos.getDirectionTo(pos));
}

// RawMemory

{
    // RawMemory.segments

    RawMemory.setActiveSegments([0, 3]);
    // on the next tick
    const segmentZero = RawMemory.segments[0];
    RawMemory.segments[3] = '{"foo": "bar", "counter": 15}';

    // RawMemory.foreignSegment

    RawMemory.setActiveForeignSegment("player");
    // on the next tick
    const playerSegment = RawMemory.foreignSegment;
    // --> {"username": "player", "id": 40, "data": "Hello!"}

    // RawMemory.interShardSegment

    RawMemory.interShardSegment = JSON.stringify({
        creeps: {
            Bob: { role: "claimer" },
        },
    });

    // on another shard
    const interShardData = JSON.parse(RawMemory.interShardSegment);
    if (interShardData.creeps[creep.name]) {
        creep.memory = interShardData[creep.name];
        delete interShardData.creeps[creep.name]; // tslint:disable-line no-dynamic-delete
    }
    RawMemory.interShardSegment = JSON.stringify(interShardData);

    // RawMemory.get()
    const myMemory = JSON.parse(RawMemory.get());

    // RawMemory.set(value)
    RawMemory.set(JSON.stringify(myMemory));

    // RawMemory.setActiveSegments(ids)
    RawMemory.setActiveSegments([0, 3]);

    // RawMemory.setActiveForeignSegment(username, [id])
    RawMemory.setActiveForeignSegment("player");
    RawMemory.setActiveForeignSegment("player", 10);
    RawMemory.setActiveForeignSegment(null);

    // RawMemory.setDefaultPublicSegment(id)
    RawMemory.setPublicSegments([5, 20, 21]);
    RawMemory.setDefaultPublicSegment(5);
    RawMemory.setDefaultPublicSegment(null);

    // RawMemory.setPublicSegments(ids)
    RawMemory.setPublicSegments([5, 3]);
    RawMemory.setPublicSegments([]);
}

// InterShardMemory

{
    let localShardData = "";
    InterShardMemory.setLocal(localShardData);
    localShardData = InterShardMemory.getLocal();

    const remoteShardData: string = InterShardMemory.getRemote("shard2") || "";
}

// Find Overloads

{
    const creeps = room.find(FIND_HOSTILE_CREEPS);
    creeps[0].say(creeps[1].name);

    const flags = room.find(FIND_FLAGS);
    flags[0].remove();

    const spawns = room.find(FIND_HOSTILE_SPAWNS);
    spawns[0].spawning;

    const sources = room.find(FIND_SOURCES);
    sources[0].ticksToRegeneration;

    const resources = room.find(FIND_DROPPED_RESOURCES);
    resources[0].resourceType;

    const sites = room.find(FIND_CONSTRUCTION_SITES);
    sites[0].remove();

    const extensionsites = room.find(FIND_CONSTRUCTION_SITES, {
        filter: (site): site is ConstructionSite<STRUCTURE_EXTENSION> => {
            return site.structureType === STRUCTURE_EXTENSION;
        },
    });
    // Should always be true. needs proper testing
    extensionsites[0].structureType === STRUCTURE_EXTENSION;

    // Should have type (_HasRoomPosition | RoomPosition)[]
    const exits = room.find(FIND_EXIT);

    const creepsHere = room.lookForAt(LOOK_CREEPS, 10, 10);
    creepsHere[0].getActiveBodyparts(ATTACK);

    const towers = room.find<StructureTower>(FIND_MY_STRUCTURES, {
        filter: structure => {
            return structure.structureType === STRUCTURE_TOWER;
        },
    });
    towers[0].attack(creeps[0]);
    towers[0].attack(creeps[0] as AnyCreep);
    towers[0].attack(powerCreep);
    towers[0].attack(spawns[0]);
    towers[0].heal(powerCreep);

    const isTower = (structure: AnyStructure): structure is StructureTower => {
        return structure.structureType === STRUCTURE_TOWER;
    };

    const tower = room.find(FIND_MY_STRUCTURES, {
        filter: isTower,
    })[0];
    tower.attack(creeps[0]);
    tower.attack(creeps[0] as AnyCreep);
    tower.attack(powerCreep);
    tower.attack(spawns[0]);
    tower.heal(powerCreep);
}

// RoomPosition Finds

{
    // Should have type Creep
    const hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostileCreep !== null) {
        creep.say(hostileCreep.name);
    }

    const tower = creep.pos.findClosestByPath<StructureTower>(FIND_HOSTILE_STRUCTURES, {
        filter: structure => {
            return structure.structureType === STRUCTURE_TOWER;
        },
        algorithm: "astar",
    });
    if (tower !== null) {
        tower.attack(creep);
        tower.attack(powerCreep);
    }

    // Generic type predicate filter
    const isStructureType = <T extends StructureConstant, S extends ConcreteStructure<T>>(structureType: T) => {
        return (structure: AnyStructure): structure is S => {
            return structure.structureType === structureType as string;
        };
    };

    const tower2 = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
        filter: isStructureType(STRUCTURE_TOWER),
        algorithm: "astar",
    });
    if (tower2 !== null) {
        tower2.attack(creep);
        tower2.attack(powerCreep);
    }

    const creepWithEnergy = creep.pos.findClosestByPath(creep.room.find(FIND_CREEPS), { filter: c => c.store.energy > 0 });

    const creepAbove = creep.pos.findClosestByPath(creep.room.find(FIND_CREEPS).map(c => c.pos), {
        filter: p => p.getDirectionTo(creep) === TOP,
    });

    const rampart = creep.pos.findClosestByRange<StructureRampart>(FIND_HOSTILE_STRUCTURES, {
        filter: structure => {
            return structure.structureType === STRUCTURE_RAMPART;
        },
    });
    if (rampart !== null) {
        rampart.isPublic;
    }

    // Should have type Creep[]
    const hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
    hostileCreeps[0].saying;

    const labs = creep.pos.findInRange<StructureLab>(FIND_MY_STRUCTURES, 4, {
        filter: structure => {
            return structure.structureType === STRUCTURE_LAB;
        },
    });

    labs[0].boostCreep(creep);
}

// LookAt Finds

{
    const matrix = room.lookAtArea(10, 10, 20, 20, false);
    for (const y of Object.keys(matrix)) {
        const row = matrix[y as unknown as number];
        for (const x of Object.keys(row)) {
            const pos = new RoomPosition(+x, +y, room.name);
            const objects = row[x as unknown as number];
            if (objects.length > 0) {
                objects.map(o => o.type);
            }
        }
    }

    const nukes = room.lookForAt(LOOK_NUKES, creep.pos);

    nukes[0].launchRoomName;

    const flags = room.lookForAtArea(LOOK_FLAGS, 10, 10, 20, 20);

    const x = flags[10];
    const y = x[11];
    const entry = y[0];
    entry.flag.remove();

    const creeps = room.lookForAtArea(LOOK_CREEPS, 10, 10, 20, 20, true);

    creeps[0].x;
    creeps[0].y;
    creeps[0].creep.move(TOP);
}

// StoreDefinition

{
    for (const resourceType of resources(creep.carry)) {
        const amount = creep.carry[resourceType];
        creep.drop(resourceType, amount);
    }

    const extension = new StructureExtension("" as Id<StructureExtension>);

    const e1: number = extension.store.getUsedCapacity(RESOURCE_ENERGY);
    const e2: number = extension.store[RESOURCE_ENERGY];

    // Invalid resource type for extension
    const eg1: null = extension.store.getUsedCapacity(RESOURCE_GHODIUM);
    const eg2: null = extension.store.getFreeCapacity(RESOURCE_GHODIUM);
    const eg3: null = extension.store.getCapacity(RESOURCE_GHODIUM);
    const eg4: 0 = extension.store.G;

    const storage = new StructureStorage("" as Id<StructureStorage>);

    const sg1: number = storage.store.getUsedCapacity(RESOURCE_GHODIUM);
    const sg2: number = storage.store.getFreeCapacity(RESOURCE_GHODIUM);
    const sg3: number = storage.store.getCapacity(RESOURCE_GHODIUM);
}

// Advanced Structure types
{
    const owned = Game.getObjectById("blah" as Id<AnyOwnedStructure>)!;
    const owner = owned.owner && owned.owner.username;
    owned.notifyWhenAttacked(false);

    const structs = room.find(FIND_MY_STRUCTURES);
    structs.forEach(struct => {
        switch (struct.structureType) {
            case STRUCTURE_CONTROLLER:
                const usernameOptional: string | undefined = struct.owner && struct.owner.username;
                break;
            default:
                const usernameRequired: string = struct.owner.username;
                break;
        }
    });

    const unowned = Game.getObjectById("blah2" as Id<AnyStructure>)!;
    const hp = unowned.hits / unowned.hitsMax;

    // test discriminated union
    switch (unowned.structureType) {
        case STRUCTURE_TOWER:
            unowned.heal(Game.creeps.myCreep);
            break;
        case STRUCTURE_CONTAINER:
        case STRUCTURE_STORAGE:
        case STRUCTURE_TERMINAL:
            const energyPercent = unowned.store.energy / unowned.storeCapacity;
            break;
        case STRUCTURE_WALL:
        case STRUCTURE_RAMPART:
            const wallHp = unowned.hits / unowned.hitsMax;
            break;
    }

    // test discriminated union using filter functions on find
    const from = Game.rooms.myRoom.find(FIND_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store.energy > 0,
    })[0];
    const to = from.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && s.energy < s.energyCapacity,
    });

    Game.rooms.myRoom
        .find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_RAMPART,
        })
        .forEach(r => r.notifyWhenAttacked(false));
}

{
    // Test that you can use signatures
    EXTENSION_ENERGY_CAPACITY[Game.rooms.myRoom.controller!.level];

    REACTIONS[Object.keys(creep.carry)[0]];

    BOOSTS[creep.body[0].type];
}

// Tombstones

{
    const tombstone = room.find(FIND_TOMBSTONES)[0];

    (tombstone.creep as PowerCreep).spawnCooldownTime;
    (tombstone.creep as Creep).my;

    tombstone.store.energy;

    tombstone.id;

    const creep = Game.creeps["dave"];
    creep.withdraw(tombstone, RESOURCE_ENERGY);
}

// Ruin

{
    const ruin = room.find(FIND_RUINS)[0];

    creep.withdraw(ruin, RESOURCE_ENERGY);
    powerCreep.withdraw(ruin, RESOURCE_ENERGY);
}

{
    if (Game.cpu.hasOwnProperty("getHeapStatistics")) {
        const heap = Game.cpu.getHeapStatistics!();
        heap.total_heap_size;
    }
}

// StructurePortal

{
    const portals = room.find<StructurePortal>(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_PORTAL });
    portals.forEach((p: StructurePortal) => {
        const state = p.ticksToDecay === undefined ? "stable" : "unstable";
        if (p.destination instanceof RoomPosition) {
            Game.notify(`Found ${state} inter-room portal to ${p.destination.toString()}`);
        } else {
            Game.notify(`Found ${state} inter-shard portal to ${p.destination.shard} ${p.destination.room}`);
        }
    });
}

// ConstructionSite

{
    room.createConstructionSite(10, 10, STRUCTURE_EXTENSION);
    room.createConstructionSite(10, 11, STRUCTURE_SPAWN, "mySpawn");

    const pos = new RoomPosition(10, 10, room.name);
    room.createConstructionSite(pos, STRUCTURE_EXTENSION);
    room.createConstructionSite(pos, STRUCTURE_SPAWN, "mySpawn");
    pos.createConstructionSite(STRUCTURE_EXTENSION);
    pos.createConstructionSite(STRUCTURE_SPAWN, "mySpawn");
}

// StructureLab

{
    const lab0 = Game.getObjectById("lab" as Id<StructureLab>);
    const lab1 = Game.getObjectById("lab" as Id<StructureLab>);
    const lab2 = Game.getObjectById("lab" as Id<StructureLab>);
    if (lab0 !== null && lab1 !== null && lab2 !== null) {
        if (lab1.mineralAmount >= LAB_REACTION_AMOUNT && lab2.mineralAmount >= LAB_REACTION_AMOUNT && lab0.mineralType === null) {
            lab0.runReaction(lab1, lab2);
        }
        // nevermind, reverse that
        lab0.reverseReaction(lab1, lab2);
    }
}

// Room event log

{
    room.getEventLog();
    room.getEventLog(true);

    const events = room.getEventLog();

    const event = events[0];

    switch (event.event) {
        case EVENT_ATTACK:
            const attackType: EventAttackType = event.data.attackType;
            break;
        case EVENT_BUILD:
            const energySpent: number = event.data.energySpent;
            break;
        case EVENT_POWER:
            const power = event.data.power;
            break;
    }
}

// Room.Terrain

{
    const room = Game.rooms[""];

    const myTerrain = room.getTerrain();

    const ret = myTerrain.get(5, 5);
    if (ret === 0) {
        /*plain*/
    }
    if (ret === TERRAIN_MASK_SWAMP) {
        /*swamp*/
    }
    if (ret === TERRAIN_MASK_WALL) {
        /*wall*/
    }

    const enemyTerrain = new Room.Terrain("W2N5");
}

// Creep.body
function atackPower(creep: Creep) {
    return creep.body
        .map(part => {
            if (part.type === ATTACK) {
                const multiplier = part.boost ? BOOSTS[part.type][part.boost].attack : 1;
                return multiplier * ATTACK_POWER;
            }
            return 0;
        })
        .reduce((a, b) => a + b);
}

// Factories and Commodities

{
    const factory = new StructureFactory("" as Id<StructureFactory>);

    if (!factory.level) {
        powerCreep.usePower(PWR_OPERATE_FACTORY, factory);
    }

    creep.transfer(factory, RESOURCE_CELL, 20);
    creep.transfer(factory, RESOURCE_OXIDANT, 36);
    creep.transfer(factory, RESOURCE_LEMERGIUM_BAR, 16);
    creep.transfer(factory, RESOURCE_ENERGY, 8);

    factory.produce(RESOURCE_PHLEGM);

    factory.produce(RESOURCE_BATTERY);
    factory.produce(RESOURCE_ENERGY);

    factory.produce(RESOURCE_GHODIUM);
    factory.produce(RESOURCE_GHODIUM_MELT);

    creep.withdraw(factory, RESOURCE_PHLEGM);

    // Energy and ghodium commodities
    COMMODITIES[RESOURCE_ENERGY];
    COMMODITIES[RESOURCE_GHODIUM];

    // Mineral commodities
    COMMODITIES[RESOURCE_UTRIUM];
    COMMODITIES[RESOURCE_LEMERGIUM];
    COMMODITIES[RESOURCE_KEANIUM];
    COMMODITIES[RESOURCE_ZYNTHIUM];
    COMMODITIES[RESOURCE_OXYGEN];
    COMMODITIES[RESOURCE_HYDROGEN];
    COMMODITIES[RESOURCE_CATALYST];

    // Commodity commodities
    COMMODITIES[RESOURCE_UTRIUM_BAR];
    COMMODITIES[RESOURCE_LEMERGIUM_BAR];
    COMMODITIES[RESOURCE_ZYNTHIUM_BAR];
    COMMODITIES[RESOURCE_KEANIUM_BAR];
    COMMODITIES[RESOURCE_GHODIUM_MELT];
    COMMODITIES[RESOURCE_OXIDANT];
    COMMODITIES[RESOURCE_REDUCTANT];
    COMMODITIES[RESOURCE_PURIFIER];
    COMMODITIES[RESOURCE_BATTERY];
    COMMODITIES[RESOURCE_COMPOSITE];
    COMMODITIES[RESOURCE_CRYSTAL];
    COMMODITIES[RESOURCE_LIQUID];
    COMMODITIES[RESOURCE_WIRE];
    COMMODITIES[RESOURCE_SWITCH];
    COMMODITIES[RESOURCE_TRANSISTOR];
    COMMODITIES[RESOURCE_MICROCHIP];
    COMMODITIES[RESOURCE_CIRCUIT];
    COMMODITIES[RESOURCE_DEVICE];
    COMMODITIES[RESOURCE_CELL];
    COMMODITIES[RESOURCE_PHLEGM];
    COMMODITIES[RESOURCE_TISSUE];
    COMMODITIES[RESOURCE_MUSCLE];
    COMMODITIES[RESOURCE_ORGANOID];
    COMMODITIES[RESOURCE_ORGANISM];
    COMMODITIES[RESOURCE_ALLOY];
    COMMODITIES[RESOURCE_TUBE];
    COMMODITIES[RESOURCE_FIXTURES];
    COMMODITIES[RESOURCE_FRAME];
    COMMODITIES[RESOURCE_HYDRAULICS];
    COMMODITIES[RESOURCE_MACHINE];
    COMMODITIES[RESOURCE_CONDENSATE];
    COMMODITIES[RESOURCE_CONCENTRATE];
    COMMODITIES[RESOURCE_EXTRACT];
    COMMODITIES[RESOURCE_SPIRIT];
    COMMODITIES[RESOURCE_EMANATION];
    COMMODITIES[RESOURCE_ESSENCE];
}

// <strike>Horse armor!</strike>Pixels!
{
    const ret: OK | ERR_NOT_ENOUGH_RESOURCES | ERR_FULL = Game.cpu.generatePixel();
}

// Game.map.visual
{
    const mapVis = Game.map.visual;
    const point1 = new RoomPosition(1, 1, "E1N1");
    const point2 = new RoomPosition(1, 1, "E1N8");
    const point3 = new RoomPosition(1, 1, "E8N8");
    const point4 = new RoomPosition(1, 1, "E1N8");

    mapVis
        .line(point1, point2)
        .circle(point3, { fill: "#f2f2f2" })
        .poly([point1, point2, point3, point4])
        .rect(point3, 50, 50);

    const size: number = mapVis.getSize();

    const visData = mapVis.export();
    mapVis.clear();
    mapVis.import(visData);
}

// Id
{
    const roomId = "" as Id<Room>; // $ExpectError
    const creep = Game.getObjectById("" as Id<Creep>);
    const foo = Game.getObjectById<StructureTower>("" as Id<Creep>); // $ExpectError
}
