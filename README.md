# HTMLTagDetection
Detect HTML Tags 


Sample code
```js
'use strict';


const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stream = require('stream');
var  HtmlTagDetector = require('htmltagdetector');


var debug = true;
//var parser = new Parser({trim: true});


if (process.argv.length <= 3) {
	if( debug ) {
		console.log("Usage: node " + path.basename(__filename) + " <source of HTML file>" + " <target of js file>"+ " <output file>");
	}
    process.exit(-1);
}

var inputHtmlFile = process.argv[2];
var ruleJSFile = process.argv[3];
var outputfile = process.argv[4];

HtmlTagDetector.detectTags(inputHtmlFile, ruleJSFile, outputfile);

```

Rule File
This file can be overrided and easily to chain custom rules
```js
[

{"rulename":"titlerule", "tag":{"min":1,"name":"head", "tag":{"min":1,"name":"title", "text": "true"}}},
{"rulename":"metarule","tag":{"min":1,"name":"head", "tag":{"min":1,"name":"meta", "attribs": [{"name":"keywords"}]}}},
{"rulename":"metarule","tag":{"min":1,"name":"head", "tag":{"min":1,"name":"meta", "attribs": [{"name":"descriptions"}]}}},
{"rulename":"strongrule","tag":{"name":"strong", "min":15}},
{"rulename":"hrule","tag":{"name":"H1", "min":1}},
{"rulename":"imgrule","tag":{"min":1,"name":"img", "attribs":[{"alt":""}]}},
{"rulename":"arule","tag":{"min":1,"name":"a", "attribs":[{"rel":""}]}}

]
```
