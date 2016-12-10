var fs = require('fs'),
    path = require('path'),

    templateUtils = require('./lib/utils');

var SEVERITIES = {
    'error': 'errors',
    'warning': 'warnings'
};

var CWD = process.cwd();

module.exports = function (results) {
    var reportPath = path.resolve('stylelint-html-report.html'),
        data = {
            pageTitle: 'Stylelint report'
        };

    results = results.filter((result) => result.warnings.length > 0);

    data.files = results.map(function(result) {
        var filePath = path.relative(CWD, result.source),
            file = {
                path: filePath,
                warnings: 0,
                errors: 0
            };

        file.messages = result.warnings.map(function(error) {
            file[SEVERITIES[error.severity]]++;

            return {
                line: error.line,
                column: error.character,
                severity: error.severity,
                evidence: error.text,
                rule: error.rule
            };
        });

        return file;
    });

    fs.writeFileSync(reportPath, templateUtils.applyTemplates(data));

    return 'Stylelint report written to ' + reportPath;
};
