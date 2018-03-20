var sass = require('node-sass')
var fs = require('fs')
var tinycolor = require('tinycolor2')

function cssConform(file) {
    file = file.replace(/:!/g, ":_qnot_")
    file = convertHEX(file)
    return file
}

function qtConform(file) {
    cleanFile = file.replace(/:_qnot_/g, ":!")
    cleanFile = convertRGBA(cleanFile)
    return cleanFile
}

var hexRE = new RegExp("#(?:([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2}))", 'g')
var rgbRE = new RegExp(/(rgba|rgb)\((\d+), (\d+), (\d+)(|, ([-+]?[0-9]*\.?[0-9]+))\)/, 'g')

function convertHEX(file) {
    return file.replace(hexRE, (match) => {
        color = tinycolor(match)
        return color.toRgbString()
    })
}

function convertRGBA(file) {
    return file.replace(rgbRE, (match) => {
        color = tinycolor(match)
        return color.toHex8String()
    })
}
var importRE = new RegExp(/@import "(.*?)"/, 'g')

function checkIfImports(file) {
    ret = ""
    Imp = file.replace(importRE, (match) => {
        path = match.split('"')[1]
        path = path.split('"')[0]
        file = fs.readFileSync(path+ ".scss", "utf8")
        ret += cssConform(file)
        return ""
    });
    return ret += Imp
}

var exports = module.exports = {};

exports.compileToCss = function(input, output) {
    var file = fs.readFileSync(input, "utf8")

    file = checkIfImports(file)

    sass.render({
        data: cssConform(file),
        includePaths: [input]
    }, (err, res) => {
        if(err) {
            console.log("Error while compiling\n" , err)
        }
        fs.writeFileSync(output, qtConform(res.css.toString()), "utf8")
        console.log("Compiled successfully")
    })
}