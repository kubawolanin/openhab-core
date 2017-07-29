import * as _ from 'lodash'
import { floors, devices, DEVICES_SUFFIX } from './definitions'

export const GROUP_PREFIX = 'g';

export function addFloors(floor, model) {
    let items = [];
    if (model.floorsCount > 1) {
        items.push({
            type: 'Group',
            name: floor.abbr,
            label: floor.name || floor.value,
            category: model.itemsIcons ? floor.icon : '',
            groupNames: ['Home'],
            entryType: 'floor'
        });
    }

    return items;
}

export function addRooms(floor, model) {
    let items = [];

    if (floor && floor.value && !_.isUndefined(model[floor.value])) {
        model[floor.value].forEach(function(room) {
            var roomDevices = floor.value + '_' + room.value + DEVICES_SUFFIX;
            var floorPrefix = model.floorsCount > 1 ? floor.abbr + '_' : '';

            items.push({
                type: 'Group',
                name: floorPrefix + room.value,
                label: room.name || room.value,
                category: model.itemsIcons ? room.icon : '',
                groupNames: _.compact([
                    'Home',
                    model.floorsCount > 1 ? floor.abbr : ''
                ]),
                entryType: 'room'
            });

            items = [
                ...items,
                ...addDevices(room, model, floorPrefix, roomDevices)
            ];
        });
    }

    return items;
}

export function addDevices(room, model, floorPrefix, roomDevices) {
    let deviceCollection = model[roomDevices] || [];

    if (!room.value && _.isEmpty(deviceCollection)) {
        return [];
    }

    return deviceCollection.map(device => ({
        type: _.first(device.type.split(':')),
        name: floorPrefix + room.value + '_' + device.value,
        label: device.name || device.value,
        category: model.itemsIcons ? device.icon : '',
        groupNames: [
            floorPrefix + room.value,
            GROUP_PREFIX + device.value
        ],
        tags: addTags(device, model),
        entryType: 'device'
    }));
}

/**
 * Generates a list of device groups
 * 
 * @param {Object} model 
 * @return {string}
 */
export function addDeviceGroups(model) {
    let items = [];
    let chosenDevices = getChosenDevices(model);

    chosenDevices.forEach(function(dev) {
        let device = _.find(devices, { value: dev });

        if (device) {
            let type = device.type.split(':');
            let groupType = _.first(type);
            let groupFuncName = type[1] ? type[1].split('(')[0] : '';
            let groupFuncArgs = type[1] && type[1].split('(')[1] ? type[1].split('(')[1]
                .split(',')
                .map((arg) => arg.trim().replace(/\W/g, '')) : [];

            let item = {
                type: 'Group',
                name: GROUP_PREFIX + device.value,
                label: device.name || device.value,
                category: model.itemsIcons ? device.icon : '',
                groupNames: ['Home'],
                groupType: groupType,
                entryType: 'deviceGroup'
            };

            if (groupFuncName) {
                item = _.extend({}, item, {
                    function: {
                        name: groupFuncName
                    }
                });

                if (!_.isEmpty(groupFuncArgs)) {
                    item.function.params = groupFuncArgs;
                }
            }

            items.push(item);
        }
    });

    return _.uniq(items);
}

/**
 * Gets list of devices chosen
 * from collection
 * 
 * @param {*} model 
 * @return {Array}
 */
export function getChosenDevices(model) {
    return _.chain(model)
        .pickBy((value, key) => _.endsWith(key, DEVICES_SUFFIX))
        .flatMap()
        .map((item) => item.value)
        .uniq()
        .value() || [];
}

/**
 * For a given device it creates a HomeKit-compatible
 * set of tags.
 * 
 * @param {Object} device 
 * @param {Object} model 
 * @return {Array}
 */
function addTags(device, model) {
    var type = _.first(device.type.split(':'));
    var tags = [];

    switch (type) {
        case 'Switch':
        case 'Dimmer':
        case 'Color':
            tags.push('Switchable');
            break;
        default:
            break;
    }

    switch (device.value) {
        case 'Light':
            tags = ['Lighting'];
        case 'Motion':
            tags = [];
        default:
            break;
    }

    return model.itemsTags ? tags : [];
}

export function getItems(model) {
    let items = [{
        type: 'Group',
        name: 'Home',
        label: model.homeName,
        category: model.itemsIcons ? 'house' : '',
        entryType: 'home'
    }];

    for (var i = 0; i < model.floorsCount; i++) {
        var floor = floors[i];

        items = [
            ...items,
            ...addFloors(floor, model),
            ...addRooms(floor, model)
        ];
    }

    items = [
        ...items,
        ...addDeviceGroups(model)
    ]

    return items;
}

/**
 * Returns array of Items
 * without `entryType` which is not a valid parameter
 * for the request
 * 
 * @param {*} model 
 */
export function generateItemsJson(model) {
    let items = getItems(model);
    return _.map(items, item => _.omit(item, ['entryType']));
}