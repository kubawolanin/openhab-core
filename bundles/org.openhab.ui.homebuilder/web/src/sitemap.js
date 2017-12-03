import * as s from 'underscore.string'
import { generateSitemapJson } from './restSitemap'

function cleanLabel(label) {
    return label.replace(/\[(.*?)\]/, '').trim();
}

function addWidgets(widget, pad) {
    let source = widget.linkedPage ? widget.linkedPage.widgets : widget.widgets;
    return source.map(widget => {
        let line = widget.type;

        line += widget.item ? ` item=${widget.item.name}` : '';
        line += widget.label ? ` label="${cleanLabel(widget.label)}"` : '';
        line += widget.icon && widget.icon !== 'none' ? ` icon="${widget.icon}"` : '';

        if ((widget.linkedPage && widget.linkedPage.widgets.length) ||
            widget.widgets.length) {
            let space = s.pad(' ', pad + 2 || 6);
            line += ' {\n';
            line += space;
            line += addWidgets(widget).join(`\n${space}`);
            line += `\n${s.pad(' ', pad)}}\n`;
        }

        return s.pad(' ', pad || 4) + line;
    })
}

function addFrames(sitemap) {
    return sitemap.homepage.widgets.map(widget => {
        return [
            s.pad(' ', 4) + widget.type + ` label="${widget.label}" icon="${widget.icon}" {`,
            addWidgets(widget, 6).join('\n'),
            s.pad(' ', 4) + '}\n'
        ].join('\n');
    });
}

export function generateSitemap(model) {
    let sitemap = generateSitemapJson(model);

    return [
        'sitemap ' + sitemap.name + ' label="' + sitemap.label + '" {',
        ...addFrames(sitemap),
        '}'
    ].join('\n');
}