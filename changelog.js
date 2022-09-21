#!/usr/bin/env node


/**
* @typedef {"Added" | "Changed" | "Fixed" | "Removed" | "Deprecated" | "Security" | "Performance" | "Other" | "Release"} Title
* @typedef {{ hash: string, message: string }} Commit
* @typedef { Partial<Record<Title, Array<Commit>>> } Changelog
*/


const fs = require("fs");
const readline = require('readline');
const version = require('../inside/package.json').version;


const file = getChangelogPath() || "./CHANGELOG.md"
const changelogs = {}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});


rl.on('line', function (line) {
    const parts = line.split(':');
    const message = parts[1].trim();
    const [hash, title] = parts[0].split(" ");
    if (!changelogs[title]) {
        changelogs[title] = [];
    }
    changelogs[title].push({ hash, message });
});


rl.on("close", () => updateChangelog());


function getChangelogPath() {
    if (process.argv.length > 2) {
        return process.argv[2];
    }
}


function isTime() {
    const date = new Date();
    return new Intl.DateTimeFormat('uk-UA', { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}


function quantityCommits(title) {
    return changelogs[title].length;
}


function createTitle(title, quantity) {
    return `\n### ${title} (${quantity} changes)\n\n`;
}


function createMessage(commit) {
    return `- [${commit.message}](${commit.hash})\n`;
}


function createMessages(title) {
    const messagesSource = changelogs[title];
    return messagesSource.map((value) => createMessage(value)).join("");
}


function createSection(title) {
    const quantity = quantityCommits(title);
    const changelogTitle = createTitle(title, quantity);
    const changelogMessages = createMessages(title);
    return changelogTitle + changelogMessages + "\n";
}


function createReleaseTitle() {
    return `## ${version} (${isTime()})\n`;
}


function writeToFile(changelogText) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) return console.error(err);
        fs.writeFile(file, changelogText + data, (err) => {
            if (err) console.error(err);
        });
    });
}


function updateChangelog() {
    const keys = Object.keys(changelogs);
    const changelogText = createReleaseTitle() + keys.reduce((prev, curr) => prev + createSection(curr), "");
    writeToFile(changelogText);
}
