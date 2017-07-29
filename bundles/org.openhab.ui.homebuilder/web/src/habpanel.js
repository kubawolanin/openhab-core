import * as _ from 'lodash'
import { floors, devices, DEVICES_SUFFIX } from './definitions'
import { getChosenDevices } from './restItems'

/**
 * Generates a HABPanel's widget object
 * @param {*} options 
 */
function makeWidget(options) {
    let row = options.row > 0 ? options.row * 2 : 0;
    let widget = {
        item: options.item,
        name: options.name,
        sizeX: 2,
        sizeY: 2,
        type: options.type,
        row: row,
        col: options.col,
        font_size: '24',
        useserverformat: true
    };

    if (options.type === 'switch') {
        widget = _.extend({}, widget, {
            iconset: 'eclipse-smarthome-classic',
            icon: options.icon,
            icon_size: 64
        });
    } else {
        widget = _.extend({}, widget, {
            backdrop_iconset: 'eclipse-smarthome-classic',
            backdrop_icon: options.icon,
            backdrop_center: true
        });
    }

    return widget;
}

function getWidgetType(type) {
    let widget = '';
    switch (type) {
        case 'Dimmer':
            widget = 'slider';
            break;
        case 'Switch':
            widget = 'switch';
            break;
        default:
            widget ='dummy';
            break;
    }

    return widget;
}

/**
 * Generates an array widgets for specific Dashboard
 * @param {*} device 
 * @param {*} model 
 */
function makeWidgets(device, model) {
    let widgets = [];

    for (var i = 0; i < model.floorsCount; i++) {
        var floor = floors[i];

        if (floor && floor.value && !_.isUndefined(model[floor.value])) {
            model[floor.value].forEach(function(room) {
                let roomDevices = floor.value + '_' + room.value + DEVICES_SUFFIX;
                let deviceCollection = model[roomDevices] || [];
                let dev = deviceCollection.find(d => d.value === device.value);

                if (dev) {
                    widgets.push(makeWidget({
                        item: (model.floorsCount > 1 ? floor.abbr + '_' : '') + room.value + '_' + dev.value,
                        name: room.name,
                        type: getWidgetType(_.first(device.type.split(':'))),
                        row: _.chunk(widgets, 6).length - 1,
                        col: (widgets.length * 2) % 12,
                        icon: device.icon
                    }));
                }
            });
        }
    }

    return widgets;
};

/**
 * Generates a full HABPanel dashboard set
 * @param {*} model 
 */
export function generateDashboard(model) {
    var chosenDevices = getChosenDevices(model);

    return chosenDevices.length ? chosenDevices.map((dev) => {
        let device = _.find(devices, { value: dev });
        return {
            id: device.value,
            name: device.name || device.value,
            row: 0,
            col: 0,
            tile: {
                backdrop_iconset: 'eclipse-smarthome-classic',
                backdrop_icon: device.icon,
                icon_size: 32
            },
            widgets: makeWidgets(device, model)
        }
    }) : '';
}

