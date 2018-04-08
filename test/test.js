'use strict';


const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stream = require('stream');
var  HtmlTagDetector = require('htmltagdetector');


var debug = true;
//var parser = new Parser({trim: true});


if (process.argv.length <= 3) {
        if( debug )
                console.log("Usage: node " + path.basename(__filename) + " <source of XML file>" + " <target of js file>"+ " <output file>");
            process.exit(-1);
}

var inputHtmlFile = process.argv[2];
var ruleJSFile = process.argv[3];
var outputfile = process.argv[4];

HtmlTagDetector.detectTags(inputHtmlFile, ruleJSFile, "aaa.txt");






