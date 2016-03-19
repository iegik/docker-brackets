'use strict';
var path = require('path'),
    http = require('http'),
    express = require('express'),
    brackets = require('brackets'),
    fs = require('fs'),
    state = require('./.brackets/state.json'),
    app = express(),
    server = http.createServer(app),
    bracketsOpts = {
        port: 3000,
        httpRoot: '/brackets',
        projectsDir: path.join(__dirname, '../', '/projects'),
        supportDir: path.join(__dirname, '.', '/.brackets'),
        allowUserDomains: true
    };

(function() {
    var childProcess = require("child_process"),
        oldSpawn = childProcess.spawn;
    function mySpawn() {
        fs.readFile('./.brackets/state.json', 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            state = JSON.parse(data);
        });
        state["brackets-git.currentGitRoot"] = state.projectPath;
        fs.writeFile('./.brackets/state.json', JSON.stringify(state), 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            state = JSON.parse(data);
        });
        arguments[2] = {cwd:path.join(__dirname, '../', state.projectPath)};
        console.log('cwd', arguments[2].cwd);
        var result = oldSpawn.apply(null, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

brackets(server, bracketsOpts);
server.listen(bracketsOpts.port);
console.log('You can access Brackets on http://localhost:' + bracketsOpts.port + bracketsOpts.httpRoot);
