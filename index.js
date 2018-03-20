#!/usr/bin/env node
var converter = require('./converter')
var fs = require("fs")
var programm = require("commander")

programm
    .version("0.01")
    .option('-w, --watch', "Watch for filechanges")

programm
    .command('build <input> <output>')
    .action(function(input, output){
        console.log("Build", input, output)
        go(input, output)
    })

programm.parse(process.argv)

function go(input, output) {
    if(programm.watch) {
        startWatching(input, output)
    } else {
        start(input, output)
    }
}

function startWatching(input, output) {
    fs.watchFile(input, {
        interval: 1000
    }, function () {
        converter.compileToCss(input, output)
    })
}

function start(input, output) {
    converter.compileToCss(input, output)
}