/**
 * i18n definitions
 */
export var languages = [
  { name: 'English', id: 'en-UK' },
  { name: 'French', id: 'fr-FR' },
  { name: 'German', id: 'de-DE' },
  { name: 'Italian', id: 'it-IT' },
  { name: 'Polish', id: 'pl-PL' },
  { name: 'Spanish', id: 'es-ES' }
];

/**
 * Structure definitions
 */
export var floors = [
  { abbr: 'GF', value: 'GroundFloor', icon: 'groundfloor' },
  { abbr: 'FF', value: 'FirstFloor', icon: 'firstfloor' },
  { abbr: 'F2', value: 'SecondFloor', icon: 'attic' },
  { abbr: 'F3', value: 'ThirdFloor', icon: 'attic' },
  { abbr: 'F4', value: 'FourthFloor', icon: 'attic' }
];

export var rooms = [
  { value: 'Attic', icon: 'attic' },
  { value: 'Balcony', icon: '' },
  { value: 'Backyard', icon: 'grass' },
  { value: 'Basement', icon: 'cellar' },
  { value: 'Bathroom', icon: 'bath' },
  { value: 'Bedroom', icon: 'bedroom' },
  { value: 'Boiler', icon: 'boiler_viessmann' },
  { value: 'Wardrobe', icon: 'wardrobe' },
  { value: 'Cellar', icon: 'cellar' },
  { value: 'Corridor', icon: 'corridor' },
  { value: 'Deck', icon: '' },
  { value: 'Dining', icon: '' },
  { value: 'Downstairs', icon: 'cellar' },
  { value: 'Driveway', icon: 'garage_detached' },
  { value: 'Entryway', icon: 'frontdoor' },
  { value: 'FamilyRoom', icon: 'parents_2_4' },
  { value: 'FrontYard', icon: 'grass' },
  { value: 'Garage', icon: 'garage' },
  { value: 'GuestHouse', icon: 'house' },
  { value: 'GuestRoom', icon: 'parents_4_3' },
  { value: 'Hallway', icon: 'corridor' },
  { value: 'HomeCinema', icon: 'television' },
  { value: 'KidsRoom', icon: 'girl_3' },
  { value: 'Kitchen', icon: 'kitchen' },
  { value: 'LaundryRoom', icon: 'washingmachine' },
  { value: 'Library', icon: 'office' },
  { value: 'LivingRoom', icon: 'sofa' },
  { value: 'LivingDining', icon: 'sofa' },
  { value: 'Loft', icon: 'attic' },
  { value: 'Lounge', icon: 'sofa' },
  { value: 'MasterBedroom', icon: 'bedroom_red' },
  { value: 'NannyRoom', icon: 'woman_1' },
  { value: 'Office', icon: 'office' },
  { value: 'Outside', icon: 'garden' },
  { value: 'Patio', icon: 'terrace' },
  { value: 'Porch', icon: 'group' },
  { value: 'Stairwell', icon: 'signal' },
  { value: 'StorageRoom', icon: 'suitcase' },
  { value: 'Studio', icon: 'pantry' },
  { value: 'Shed', icon: 'greenhouse' },
  { value: 'Toilet', icon: 'toilet' },
  { value: 'Terrace', icon: 'terrace' },
  { value: 'Upstairs', icon: 'firstfloor' }
];

export var devices = [
  { value: 'Light', icon: 'light', type: 'Switch:OR(ON, OFF)', unit: '[(%d)]' },
  { value: 'Window', icon: 'window', type: 'Contact:OR(OPEN, CLOSED)', unit: '[MAP(en.map):%s]' },
  { value: 'Door', icon: 'door', type: 'Contact:OR(OPEN, CLOSED)', unit: '[MAP(en.map):%s]' },
  { value: 'Motion', icon: 'motion', type: 'Switch:OR(ON, OFF)', unit: '[(%d)]' },
  { value: 'Power', icon: 'poweroutlet', type: 'Switch:OR(ON, OFF)', unit: '[(%d)]' },
  { value: 'Shutter', icon: 'rollershutter', type: 'Rollershutter:OR(UP, DOWN)', unit: '[(%d)]' },
  { value: 'Blind', icon: 'rollershutter', type: 'Dimmer', unit: '[%d %%]' },
  { value: 'Fan', icon: 'fan_ceiling', type: 'Switch:OR(ON, OFF)', unit: '[(%d)]' },
  { value: 'AirCon', icon: 'climate', type: 'Switch:OR(ON, OFF)', unit: '[(%d)]' },
  { value: 'Heating', icon: 'heating', type: 'Number:AVG', unit: '[%.1f °C]' },
  { value: 'Temperature', icon: 'temperature', type: 'Number:AVG', unit: '[%.1f °C]' },
  { value: 'Humidity', icon: 'humidity', type: 'Number:AVG', unit: '[%d %%]' },
];

export const DEVICES_SUFFIX = '_devices';

