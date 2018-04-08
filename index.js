'use strict';


const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stream = require('stream');


const jsdom = require("jsdom");
const { JSDOM } = jsdom;


var debug = true;
//var parser = new Parser({trim: true});

console.log('Detecting HTML....');

if (process.argv.length <= 3) {
    if( debug )
    console.log("Usage: node " + path.basename(__filename) + " <source of XML file>" + " <target of js file>"+ " <output file>");
    process.exit(-1);
}

var inputHtmlFile = process.argv[2];
var ruleJSFile = process.argv[3];
var outputfile = process.argv[4];

var outputType = 0; //0 console, 1: file, 2: string
var inputType = 0; //0 file, 2: string




function detectTags(sourceInput, inputRuleFile, targetOutput){

	if(!sourceInput || sourceInput === 'undefined'){

	}else{
		inputType = 0;
	}

	if(!targetOutput || targetOutput === 'undefined'){
		outputType = 0;
	}else{
		outputType = 1;
	}

	
	
	fs.readFile(sourceInput, 'utf8', (err, html) => {

		const virtualConsole = new jsdom.VirtualConsole();
		const dom = new JSDOM(html, { virtualConsole, includeNodeLocations: true });
		const document = dom.window.document;

		fs.readFile(inputRuleFile, 'utf8', (err, jsFile) => {
			if (err) {
        		throw err;
    		}
			var jsonContent = JSON.parse(jsFile);
			var len = jsonContent.length;
			var i = 0;
			for( i = 0 ; i < len; i++){
				var rule = jsonContent[i];
				var result = checkNode(document, rule);
				var outputResult = "result:" + result[1];
				if( outputType == 0 ){
					console.log(outputResult);	
				}else if(outputType == 1) {
					fs.writeFile(outputFile, outputResult, 'utf8', function (err) {
		                if (err) {  
		                    console.log("write file error:" + err);
		                    return;
		                }
		            });
				}else {

				}
				
			}

	});

	});


	
}




function checkNode(domNode, ruleObj){

	
	var tagName;
	var size;
	if( ruleObj.tag){
		tagName = ruleObj.tag.name;
		var el = domNode.getElementsByTagName(tagName);
		var elLen = el.length;
		size = ruleObj.tag.min;
		var res ="\n"; 


		if( elLen >= size ){
			var i = 0;
			var checkResultCount = 0;
			var count = 0;
			var attrDetectedCount = 0;
			var attributeString="";


			for( i = 0 ; i < elLen ; i ++){

				var displayAttrString = "";
				if( ruleObj.tag.attribs && ruleObj.tag.attribs.length > 0 ){
					var attrLen = ruleObj.tag.attribs.length;
					var j = 0;
					
					var isAttrDetected = false;
					for(j = 0; j < attrLen ; j++){
						var attObj = ruleObj.tag.attribs[j];
						var key;
						
						for (key in attObj) {
							
							var attValue = el.item(i).getAttribute(key);
							if( (attObj[key] == "" && attValue != null) || (attValue == attObj[key])) {								
								 ++attrDetectedCount;
								 isAttrDetected = true;
							}

							if( attObj[key]==""){
								displayAttrString = "attribute => " + "("+key +")"; 
							}else{
								displayAttrString = "attribute => (" + key +"="  +attObj[key] +")";
							} 

							
						}

					}

					if( attrDetectedCount > 0 ) {
						attributeString = "The " + displayAttrString + " have been detected in the " + attrDetectedCount + " tag <" +ruleObj.tag.name+">";	
						attributeString  = attributeString + " and no "+ displayAttrString +" to be detected in the " + (count - attrDetectedCount + 1) + " tag <" +ruleObj.tag.name+">. ";	
					}else{
						attributeString = "!!! No " + displayAttrString +" to be detected in the " + (count - attrDetectedCount +1 ) + " tag <" +ruleObj.tag.name+">. ";		
					}
				
				}
				
				

				if( ruleObj.tag){
					++count;
					var result = checkNode( el.item(i), ruleObj.tag);
					if( result[0] == true) {
						++checkResultCount ;
					}else{

					}
				}

			}

			
			
			
			res = result[1];
			if( checkResultCount >= size) {
				res = res + " There are/is " + count + " tag <"+ ruleObj.tag.name +"> meet the rule which must greater than " + size + ". " + attributeString;
				return [true, res];
			}else{
				res = res + " " + count + " tag <"+ ruleObj.tag.name +"> not meet rule and the numer of tag less than " + size + ". " + attributeString;
				return [false, res ];
			}

		}else{
			return [false, "The tag <" + ruleObj.tag.name +"> is less than " + ruleObj.tag.min];
		}
	}else{
		return [true, "Detection Result:"];
	}
}








module.exports.detectTags = detectTags;