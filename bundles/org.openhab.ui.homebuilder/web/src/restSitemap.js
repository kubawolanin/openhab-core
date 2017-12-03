import * as _ from 'lodash'
import * as s from 'underscore.string'
import { floors } from './definitions'
import { getChosenObjects, getItems, getItemByName, GROUP_PREFIX } from './restItems'

export let sitemapName = '';

function addWidget(widget) {
    let schema = {
        widgetId: widget.uid,
        type: widget.type,
        label: widget.label || '',
        icon: widget.icon || widget.type.toLowerCase(),
        mappings: [],
        widgets: widget.widgets || []
    }

    if (widget.item) {
        schema = _.extend({}, schema, {
            item: widget.item
        });
    }

    if (widget.linkedPage) {
        schema = _.extend({}, schema, {
            linkedPage: widget.linkedPage
        });
    }

    return schema;
}

function getFloorItem(floor, model, uid) {
    let floorPrefix = '';
    let widget = {
        uid: uid,
        type: 'Frame'
    };

    if (model.floorsCount > 1) {
        floorPrefix = floor.abbr + '_';
        widget = _.extend({}, widget, {
            icon: model.itemsIcons && floor.icon ? floor.icon : '',
            label: floor.name || floor.value || ''
        });
    }

    widget.widgets = getRoomGroups(floor, model, floorPrefix, uid);

    return addWidget(widget);
}

function getRoomGroups(floor, model, floorPrefix, uid) {
    if (floor && floor.value && !_.isUndefined(model[floor.value])) {
        return model[floor.value].map((room, index) =>
            addWidget({
                uid: `${uid}_${index}`,
                type: 'Group',
                item: getItemByName(floorPrefix + room.value, model)
            })
        );
    }

    return [];
}

function getTextGroup(group, groupItems, items) {
    return addWidget({
        type: 'Text',
        label: group.label,
        icon: group.category && group.category !== 'none' ? group.category : '',
        linkedPage: {
            widgets: getDefaultItems(groupItems, items)
        }
    });
}

function getDefaultItems(groupItems, items) {
    return groupItems.map(item => {
        let room = _.find(items, { name: item.groupNames[0] });
        return addWidget({
            type: 'Default',
            label: room.label,
            item: item
        });
    });
}

function getObjectItems(model) {
    const items = getItems(model);
    let chosenObjects = getChosenObjects(model);
    let objects = chosenObjects.map(object => {
        let groupName = GROUP_PREFIX + object;
        let group = _.find(items, { name: groupName });
        let groupItems = _.filter(items, item =>
            item.groupNames && item.groupNames.includes(groupName)
        );

        return getTextGroup(group, groupItems, items);
    });

    return _.flatten(objects);
}

function addFloorWidgets(model, uid) {
    let lines = [];

    for (let i = 0; i < model.floorsCount; i++) {
        lines.push(getFloorItem(floors[i], model, `${uid}_${i}`));
    }

    return lines;
}

function addObjectWidget(model, uid) {
    let objectItems = getObjectItems(model);

    if (objectItems.length) {
        return [
            addWidget({
                uid: `${uid}_${model.floorsCount}`,
                type: 'Frame',
                label: 'Objects',
                widgets: objectItems
            })
        ];
    }

    return [];
}

function getWidgets(model, uid) {
    return [
        ...addFloorWidgets(model, uid),
        ...addObjectWidget(model, uid)
    ];
}

export function generateSitemapJson(model) {
    sitemapName = s(model.homeName)
        .slugify()
        .value()
        .replace(/-/g, '_');

    return {
        name: sitemapName,
        label: model.homeName,
        homepage: {
            id: sitemapName,
            title: model.homeName,
            leaf: false,
            widgets: getWidgets(model, sitemapName)
        }
    }
}