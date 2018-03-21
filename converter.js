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
    cleanFile = cleanFile.replace('@charset "UTF-8";', "")
    cleanFile = convertRGBA(cleanFile)
    return cleanFile
}

var hexRE = new RegExp("#(?:([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2}))", 'g')
var rgbRE = new RegExp(/(rgba|rgb)\((\d+), (\d+), (\d+)(|, ([-+]?[0-9]*\.?[0-9]+))\)/, 'g')

function convertHEX(file) {
    return file.replace(hexRE, (match) => {
        switched_match = "#" + match.substring(7,9) + match.substring(3,7) + match.substring(1,3)
        color = tinycolor(switched_match)
        return color.toRgbString()
    })
}

function convertRGBA(file) {
    return file.replace(rgbRE, (match) => {
        color = tinycolor(match)
        hex8 = color.toHex8String()
        return "#" + hex8.substring(7,9) + hex8.substring(3,7) + hex8.substring(1,3)
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
        fs.writeFileSync(output, qtConform(res.css.toString()))
        console.log("Compiled successfully")
    })
}