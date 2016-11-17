var fs = require('fs'),
    path = require('path'),

    templateUtils = require('./lib/utils'),

    files = {};

function getFileData(file) {
    return files[file] || {
        path: file,
        errors: 0,
        warnings: 0,
        messages: []
    };
}

module.exports = function (message, done) {
    var cache = this.cache,
        options = this.config.reporterOptions || {};

    if (done === 'done') {
        var reportPath = path.resolve(options.reportPath || 'stylint-html-report.html'),
            data = { pageTitle: 'Stylint report' };

        data.files = Object.keys(files).map(function(filename) {
            return files[filename];
        });

        fs.writeFileSync(reportPath, templateUtils.applyTemplates(data));

        console.log('Stylint report written to', reportPath);

        return this.done();
    }

    var severity = this.state.severity.toLowerCase(),

        fileData = getFileData(cache.file);

    fileData[severity == 'warning' ? 'warnings' : 'errors']++;

    fileData.messages.push({
        evidence: message,
        line: cache.lineNo || 0,
        column: cache.col || 0,
        rule: cache.rule,
        severity: severity
    });

    files[cache.file] = fileData;
};
