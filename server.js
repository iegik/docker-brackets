'use strict';
var path = require('path'),
    http = require('http'),
    express = require('express'),
    brackets = require('brackets'),
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
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        arguments[2] = {cwd:'/usr/src/app'};
        //console.log('cwd', arguments[2].cwd);
        var result = oldSpawn.apply(null, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

brackets(server, bracketsOpts);
server.listen(bracketsOpts.port);
console.log('You can access Brackets on http://localhost:' + bracketsOpts.port + bracketsOpts.httpRoot);
