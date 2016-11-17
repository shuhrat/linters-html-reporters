var fs = require('fs'),
    path = require('path'),

    handlebars = require('handlebars'),

    templatesDir = path.join(__dirname, '..', 'templates');

function readTemplate(templatePath) {
    return fs.readFileSync(path.join(templatesDir, templatePath),
        { encoding: 'utf-8' }
    );
}

function compileTemplate(templatePath) {
    var template = readTemplate(templatePath);

    return handlebars.compile(template);
}

function rowHelper(context, options) {
    var className;

    if (context.severity == 'error') className = 'danger';
    if (context.severity == 'warning') className = 'warning';

    return className
        ? '<tr class="' + className + '">' + options.fn(this) + '</tr>'
        : '<tr>' + options.fn(this) + '</tr>';
}

function countErrorsAndWarnings(data) {
    data.errors = 0;
    data.warnings = 0;

    data.files.forEach(function(file) {
        data.errors += file.errors;
        data.warnings += file.warnings;
    });

    return data;
}

exports.applyTemplates = function(data) {
    if (!data) {
        throw new Error('Data is undefined');
    }

    handlebars.registerHelper('row', rowHelper);

    handlebars.registerPartial({
        css: compileTemplate('partials/css.hbs'),
        summary: compileTemplate('partials/summary.hbs'),
        fileBreakdown: compileTemplate('partials/file-breakdown.hbs')
    });

    var template = compileTemplate('reporter.hbs');

    countErrorsAndWarnings(data);

    return template(data);
};
