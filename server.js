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
    var childProcess = require("child_process"),
        oldSpawn = childProcess.spawn;
    function mySpawn() {
        if(arguments[0] === '/usr/local/bin/git'){
            arguments[2] = {
                cwd:arguments[2].cwd
                    .replace(/\\/g, '/')
                    .replace(/^\/projects/,'../projects')
                    .replace(/^\/support/,'.brackets')
            };
        }
        var result = oldSpawn.apply(null, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

brackets(server, bracketsOpts);
server.listen(bracketsOpts.port);
console.log('You can access Brackets on http://localhost:' + bracketsOpts.port + bracketsOpts.httpRoot);
