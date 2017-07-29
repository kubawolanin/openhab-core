# Home Builder

> Boilerplate for the [Items](docs.openhab.org/configuration/items.html), [sitemap](http://docs.openhab.org/configuration/sitemaps.html) files and [HABPanel](http://docs.openhab.org/addons/uis/habpanel/readme.html) dashboard.

## Items

The tool allows you to generate openHAB Items for your home structure.
You can choose to generate textual `*.items` file content or construct a request directly to the REST API that'll create the items for you.


### Features

- Classifies the devices within each room and creates groups for them
- Optionally adds icons from [Classic Icon Set](http://docs.openhab.org/addons/iconsets/classic/readme.html) to the items
- Optionally adds Tags to the items - convenient for [HomeKit](http://docs.openhab.org/addons/io/homekit/readme.html)/[Hue Emulation](http://docs.openhab.org/addons/io/hueemulation/readme.html#device-tagging) add-ons users
- Automatically aligns the items vertically
- Generates a [Sitemap](http://docs.openhab.org/configuration/sitemaps.html) file
- Generates a set of HABPanel Dashboards corresponding with the Items

## Development

HomeBuilder UI is an app based on [Vue.js](vuejs.org) framework.
In order to setup the development environment simply run:

``` bash
cd web
npm install
npm run dev
```

The first command will install all necessary dependencies (including Webpack build system).
`npm run dev`, however, will serve the build with hot reload at `http://localhost:8080`.

It's recommended to debug the app on Chrome or Firefox with [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) extension.

When you're done with your changes and would like to test HomeBuilder on a real environment, run the following command:

``` bash
# build for production with minification
npm run build
```

It will build the app inside `/web/dist/` folder with source map included.
