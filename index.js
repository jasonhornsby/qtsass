#!/usr/bin/env node
var converter = require('./converter')

var input = process.argv[2]
var output = process.argv[3]

if(!input || !output) {
    console.log("Input missing")
}
converter.compileToCss(input, output)

