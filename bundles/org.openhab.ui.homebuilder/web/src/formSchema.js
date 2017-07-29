import * as _ from 'lodash'
import * as s from 'underscore.string'
import { validators } from 'vue-form-generator'
import { languages, floors, rooms, devices, DEVICES_SUFFIX } from './definitions'

/**
 * Invoked when language select has changed its value.
 * 
 * @param {Object} model
 * @param {Object} newVal
 */
function languageChanged(model, newVal) {
    this.$parent.$parent.fetchTranslations(newVal);
}

/**
 * Creates a custom room entry
 * 
 * @param {string} newTag 
 * @param {string} id 
 * @param {Object} options 
 * @param {string} value 
 */
function newRoomTag(newTag, id, options, value) {
    const tag = {
        name: newTag,
        icon: 'none',
        custom: true,
        value: s(newTag)
            .trim()
            .toLowerCase()
            .cleanDiacritics()
            .classify()
            .value()
    }
    rooms.push(tag);
    value.push(tag);
};

/**
 * Is being executed when 
 * collection of rooms in floor multiselect field
 * has changed.
 * 
 * If there's a new `room` in collection,
 * a new dynamic field is added to the floor object, e.g.
 * `"GroundFloor": [ { name: 'Bedroom', value: 'Bedroom', icon: 'bed' }]`
 * 
 * If an entry was removed from the collection,
 * a dynamic field is removed accordingly.
 * 
 * @param {Object} model 
 * @param {Array} newVal
 * @param {Array} oldVal 
 * @param {Object} field 
 */
function roomsChanged(model, newVal, oldVal, field) {
    let devicesFields = _.find(this.$options.parent.groups, { legend: 'Devices' }).fields;
    let floor = field.model;
    let oldList = oldVal ? _.map(oldVal, 'value') : [];
    let newList = _.map(newVal, 'value');
    let lastRemoved = _.first(_.difference(oldList, newList));
    let lastItem = _.last(newList);
    let roomName = '';

    if (lastItem && !lastRemoved) {
        let room = _.find(rooms, { value: lastItem });
        roomName = floor + '_' + room.value + DEVICES_SUFFIX;
        devicesFields.push({
            type: 'multiselect',
            label: (room.name || room.value) + ' (' + _.find(floors, { value: floor }).name + ')',
            styleClasses: 'rooms-list',
            model: roomName,
            placeholder: 'Type to search device',
            selectOptions: {
                multiple: true,
                hideSelected: true,
                closeOnSelect: false,
                selectLabel: '',
                trackBy: 'value',
                label: 'name',
                searchable: true,
                taggable: false
            },
            values: devices
        });
    }

    if (lastRemoved) {
        roomName = floor + '_' + lastRemoved + DEVICES_SUFFIX;
        _.remove(devicesFields, { model: roomName });
        delete model[roomName];
    }
}

/**
 * Schema describing the basic form
 * generated by vue-form-generator
 */
export var basicFields = [{
        type: 'select',
        model: 'language',
        label: 'Please select your language',
        values: function() {
            return languages;
        },
        selectOptions: {
            hideNoneSelectedText: true
        },
        onChanged: languageChanged
    },

    {
        type: 'input',
        inputType: 'text',
        label: 'Home Setup Name',
        model: 'homeName',
        readonly: false,
        disabled: false,
        placeholder: 'Home name',
        validator: validators.string
    }
];

export var floorsFields = [{
    type: 'radios',
    model: 'floorsCount',
    label: 'Number of floors',
    styleClasses: 'floors-number',
    values: [1, 2, 3, 4, 5],
    onChanged: function(model, newVal, oldVal, field) {
        let roomsFields = _.find(this.$options.parent.groups, { legend: 'Rooms' }).fields;
        if (newVal <= 5 && newVal > oldVal) {
            for (var i = oldVal; i < newVal; i++) {
                let floor = floors[i];
                let floorName = floor.value;
                let fieldExists = _.find(roomsFields, (field) => field.model === floorName);

                if (!fieldExists) {
                    roomsFields.push(roomsSelect(floorName, floor.name || floor.value));
                }
            }
        }

        if (newVal < oldVal) {
            for (var j = oldVal; j > newVal; j--) {
                let floorName = floors[j - 1].value;
                _.remove(roomsFields, { model: floorName });
                delete model[floorName];
            }
        }
    }
}];

export var settingsFields = [{
        type: 'checklist',
        model: 'filesGenerated',
        label: 'What would you like to generate?',
        multi: true,
        listBox: true,
        multiSelect: true,
        values: [
            { name: 'Items', value: 'items' },
            { name: 'Sitemap', value: 'sitemap' },
            { name: 'Dashboard', value: 'habpanel' }
        ]
    },

    {
        type: 'radios',
        label: 'How would you like to store the Items?',
        model: 'itemsType',
        visible(model) {
            return model && model.filesGenerated.includes('items');
        },
        values: [
            { name: 'Textual Configuration Files', value: 'text' },
            { name: 'Internal Database', value: 'rest' }
        ]
    },

    {
        type: 'switch',
        label: 'Append channel to the non-Group items',
        model: 'itemsChannel',
        default: true,
        textOn: 'Yes',
        textOff: 'No',
        valueOn: true,
        valueOff: false,
        visible(model) {
            return model &&
                model.filesGenerated.includes('items') &&
                model.itemsType === 'text';
        }
    },

    {
        type: 'switch',
        label: 'Include icons',
        model: 'itemsIcons',
        default: true,
        textOn: 'Yes',
        textOff: 'No',
        valueOn: true,
        valueOff: false,
        visible(model) {
            return model &&
                (model.filesGenerated.includes('items') || model.filesGenerated.includes('sitemap'));
        }
    },

    {
        type: 'switch',
        label: 'Include tags',
        model: 'itemsTags',
        default: false,
        textOn: 'Yes',
        textOff: 'No',
        valueOn: true,
        valueOff: false,
        visible(model) {
            return model && model.filesGenerated.includes('items');
        }
    }
];

/**
 * Generates a multiselect input with
 * rooms for specific floor (model)
 * 
 * @param {string} model 
 * @param {string} label 
 */
function roomsSelect(model, label) {
    return {
        type: 'multiselect',
        label: label,
        styleClasses: 'rooms-list',
        model: model,
        values: rooms,
        placeholder: 'Type to search or add room',
        selectOptions: {
            multiple: true,
            trackBy: 'value',
            label: 'name',
            selectLabel: '',
            searchable: true,
            taggable: true,
            closeOnSelect: false,
            hideSelected: true,
            tagPlaceholder: 'Add this as a new room',
            onNewTag: newRoomTag
        },
        onChanged: roomsChanged
    };
}

/**
 * Field group schema for the rooms
 */
export var roomsFields = [
    roomsSelect('GroundFloor', 'Ground Floor')
];

/**
 * Field group schema for the devices
 */
export var devicesFields = [];