#!/usr/bin/env node


const childProcess = require('child_process');


const tag = getTag().toString().trim();
gitAdd() && commitRelease(tag) && pushBranchDev() && pushGitTag(tag);


function getTag() {
    return childProcess.execSync("git tag | tail -1");
}


function gitAdd() {
    return childProcess.execSync("git add .");
}


function commitRelease(tag) {
    return childProcess.execSync(`git commit -m "Release: ${tag}."`);
}


function pushBranchDev() {
    return childProcess.execSync("git push origin dev");
}


function pushGitTag(tag) {
    return childProcess.execSync(`git push origin ${tag}`);
}
