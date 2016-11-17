var fs = require('fs'),
    path = require('path'),

    templateUtils = require('./lib/utils');

module.exports = function (errorsCollection) {
    var options = this ? (this.options || this) : {},
        reportPath = path.resolve(options.reportPath || 'jscs-html-report.html'),
        data = {
            files: [],
            pageTitle: 'JSCS report'
        };

    errorsCollection.forEach(function(errors) {
        var file = {
                path: errors.getFilename(),
                errors: 0,
                warnings: 0,
                messages: []
            };

        if (!errors.isEmpty()) {
            errors.getErrorList().forEach(function(error) {
                file.errors++;

                file.messages.push({
                    line: error.line,
                    column: error.column,
                    message: error.message,
                    evidence: errors.explainError(error),
                    severity: 'error',
                    rule: error.rule
                });
            });
        }

        data.files.push(file);
    });

    fs.writeFileSync(reportPath, templateUtils.applyTemplates(data));
    console.log('JSCS report written to', reportPath);
};
