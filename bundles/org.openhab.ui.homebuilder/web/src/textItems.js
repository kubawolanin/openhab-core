import * as _ from 'lodash'
import * as AsciiTable from 'ascii-table'
import { getItems } from './restItems'

/**
 * Generates item's type
 * e.g. `Switch` or `Group`
 * or `Group:Switch:OR(ON, OFF)`
 * 
 * @param {Object} item 
 * @param {Object} model 
 * @return {string}
 */
function generateType(item) {
    let type = item.type;

    switch (item.entryType) {
        case 'deviceGroup':
            type += ':' + item.groupType;

            if (item.function && item.function.name) {
                type += ':' + item.function.name;

                if (item.function.params) {
                    type += '(' + item.function.params.join(', ') + ')';
                }
            }
            break;
        default:
            break;
    }

    return type;
}

/**
 * Generates a label for the Item
 * @param {Object} item 
 * @return {string}
 */
function generateLabel(item) {
    return '"' + (item.label || item.name) + '"';
}

/**
 * Generates an icon if there's any.
 * 
 * @param {Object} item 
 * @param {Object} model 
 * @return {string}
 */
function generateIcon(item, model) {
    return item.category && model.itemsIcons ? '<' + item.category + '>' : null;
}

/**
 * Generates a list of groups for the item.
 * e.g. (Home, GF_Bedroom, gTemperature)
 * @param {Object} item
 * @return {string}
 */
function generateGroups(item) {
    return item.groupNames ? '(' + item.groupNames.join(', ') + ')' : '';
}

/**
 * Generates a list of tags for the item.
 * e.g. ["Switchable"]
 * @param {Object} item
 * @return {string}
 */
function generateTags(item) {
    return !_.isEmpty(item.tags) ? '["' + item.tags.join('", "') + '"]' : '';
}


/**
 * Generates a "channel" string for the device item
 * e.g. `{channel=""}`
 * @param {Object} item
 * @param {Object} model
 * @return {string}
 */
function generateChannel(item, model) {
    return item.entryType === 'device' && model.itemsChannel ? '{channel=""}' : '';
}

/**
 * Generates an array or items
 * to be later processed by AsciiTable
 * 
 * @param {string} entryType 
 * @param {Object} model 
 * @return {Array}
 */
function getItemsOfType(entryType, model) {
    let allItems = getItems(model);
    let items = _(allItems)
        .filter({ entryType: entryType })
        .uniq()
        .value() || [];

    let result = items.map((item) => {
        return [
            generateType(item),
            item.name,
            generateLabel(item),
            generateIcon(item, model),
            generateGroups(item),
            generateTags(item),
            generateChannel(item, model)
        ]
    });

    // Add some spacing between blocks
    if (!_.isEmpty(result)) {
        result.push(['']);
    }

    return result;
}

/**
 * Transforms array of lines
 * into column-aligned table
 * @param {Array} lines 
 */
function toTable(lines) {
    let table = new AsciiTable();

    // Create the ascii-table to auto-format file
    let result = table.addRowMatrix(lines)
        .removeBorder()
        .toString();

    // Cleanup the lines
    result = result.split('\n')
        .map((line) => line.slice(2).trimRight())
        .join('\n');

    return result
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Generates a textual Items file based on user input
 * Needs several datapoints from the model such as
 * floorsCount, rooms collection, devices etc.
 * @param {*} model 
 * @return {string}
 */
export function generateItems(model) {
    // On the very top add the home item
    let lines = [
        ...getItemsOfType('home', model),
        ...getItemsOfType('floor', model),
        ...getItemsOfType('room', model),
        ...getItemsOfType('device', model)
    ];

    return toTable(lines) + '\n' +
        toTable(getItemsOfType('deviceGroup', model));
}

