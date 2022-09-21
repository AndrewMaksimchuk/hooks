#!/usr/bin/env node


const childProcess = require('child_process');
const version = require('../inside/package.json').version;


setTag(version);


function setTag(version) {
    childProcess.exec(`git tag v${version}`, (error, stdout, stderr) => {
        if (error) return console.error(`error: ${error.message}`);
    });
}
