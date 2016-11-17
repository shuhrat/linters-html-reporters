var fs = require('fs'),
    path = require('path'),

    templateUtils = require('./lib/utils');

function isError(errorCode) {
    return errorCode && errorCode[0] === 'E';
}

module.exports = {
    reporter: function(results) {
        var reportPath = path.resolve('jshint-html-report.html'),
            data = {
                files: [],
                pageTitle: 'JSHint report'
            },
            files = {};

        results.forEach(function(result) {
            var filename = result.file,
                file = files[filename] || {
                    path: filename,
                    errors: 0,
                    warnings: 0,
                    messages: []
                },
                error = result.error,
                severity;

            if (isError(error.code)) {
                file.errors++;
                severity = 'error';
            } else {
                file.warnings++;
                severity = 'warning';
            }

            file.messages.push({
                line: error.line,
                column: error.character,
                evidence: error.evidence,
                severity: severity,
                rule: error.reason
            });

            files[filename] = file;

            console.log(error);

        });

        data.files = Object.keys(files).map(function(filename) {
            return files[filename];
        });

        fs.writeFileSync(reportPath, templateUtils.applyTemplates(data));
        console.log('JSHint report written to', reportPath);
    }
};

