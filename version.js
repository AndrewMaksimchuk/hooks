#!/usr/bin/env node

const readline = require('readline');
const childProcess = require('child_process');
const package = require('../inside/package.json');


const [major, minor, patch] = package.version.split(".");
const commits = {};
const counteCommits = {};


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});


rl.on('line', function (line) {
    const parts = line.split(':');
    const message = parts[1].trim();
    const [hash, title] = parts[0].split(" ");
    if (!commits[title]) {
        commits[title] = [];
    }
    commits[title].push({ hash, message });
});


rl.on("close", () => setVersion());


function counte(title) {
    return commits[title].length;
}


function countedCommits() {
    const keys = Object.keys(commits);
    keys.forEach((value) => {
        counteCommits[value] = counte(value);
    });
}


function setMinor(minor) {
    const addedNumber = counteCommits["Added"];
    return addedNumber ? Number(minor) + addedNumber : minor;
}


function setPatch(patch) {
    const keys = Object.keys(counteCommits);
    const addedNumber = keys.reduce((prev, curr) => curr === "Added" ? prev : prev + counteCommits[curr], 0);
    return addedNumber ? Number(patch) + addedNumber : patch;
}


function setVersion() {
    countedCommits();
    const ver = [major, setMinor(minor), setPatch(patch)].join(".");
    childProcess.exec(`cd ./inside && npm version ${ver}`, (error, stdout, stderr) => {
        if (error) return console.error(`error: ${error.message}`);
        if (stderr) return console.error(`stderr: ${stderr}`);
    });
}
