#!/usr/bin/env node
var fs = require('fs');
var jsonfile = require('jsonfile')
var csv = require('csvtojson');

const outputPath = './whatsnew_data/'
const csvModelFilePath = './csv/whatsnew-model.csv';
const csvDescFilePath = './csv/whatsnew-desc.csv';

const LangTable = {
    "EN": "English",
    "TW": "Traditional Chinese",
    "CN": "Simplified Chinese",
/*  "UNKNOWN": "Bulgarian",*/
    "TH": "Thai",
    "UK": "Ukrainian",
    "DA": "Danish",
    "FI": "Finnish",
    "NO": "Norwegian",
    "SV": "Swedish",
/*  "UNKNOWN": "Croatian",*/
    "SL": "Slovenian",
    "RO": "Romanian",
    "HU": "Hungarian",
    "MS": "Malay",
    "CZ": "Czech",
    "TR": "Turkish",
    "BR": "Portuguese (Brazilian)",
    "PL": "Polish",
    "ES": "Spanish",
    "NL": "Dutch",
    "KR": "Korean",
    "IT": "Italian",
    "JP": "Japanese",
    "FR": "French",
    "RU": "Russian",
    "DE": "German"
}

function newEvent(){
    this.eventId = new Date().getTime().toString();
    this.webUrl = "";
    this.appUrl = "";

    this.title = {
        "BR": "",
        "CN": "",
        "CZ": "",
        "DA": "",
        "DE": "",
        "EN": "",
        "ES": "",
        "FI": "",
        "FR": "",
        "HU": "",
        "IT": "",
        "JP": "",
        "KR": "",
        "MS": "",
        "NL": "",
        "NO": "",
        "PL": "",
        "RO": "",
        "RU": "",
        "SL": "",
        "SV": "",
        "TH": "",
        "TR": "",
        "TW": "",
        "UK": ""
    };

    this.desc = {
        "BR": "",
        "CN": "",
        "CZ": "",
        "DA": "",
        "DE": "",
        "EN": "",
        "ES": "",
        "FI": "",
        "FR": "",
        "HU": "",
        "IT": "",
        "JP": "",
        "KR": "",
        "MS": "",
        "NL": "",
        "NO": "",
        "PL": "",
        "RO": "",
        "RU": "",
        "SL": "",
        "SV": "",
        "TH": "",
        "TR": "",
        "TW": "",
        "UK": ""
    };
}

csv()
	.fromFile(csvModelFilePath)
	.on('json', (jsonObj) => {
		var supportVersion = jsonObj['Support FW version'];
		if(supportVersion == "") return true;

		var outputFile = outputPath + jsonObj['Model Name'] + ".json";

		var thisEvent = new newEvent();
		thisEvent.webUrl = (jsonObj['Web URL'].length == 0) ? "NOTSUPPORT" : jsonObj['Web URL'];
		thisEvent.appUrl = (jsonObj['App URL'].length == 0) ? "NOTSUPPORT" : jsonObj['App URL'];

		fs.readFile(outputFile, 'utf8', (err, cachedData) => {
			var outputData = {};

			try{
				var outputData = JSON.parse(cachedData);

				if(!outputData[supportVersion]){
					outputData[supportVersion] = new Array;
				}
				else{
					var isDuplicate = false;

					for(var idx=0; idx<outputData[supportVersion].length; idx++){
						if(
							outputData[supportVersion][idx].webUrl == thisEvent.webUrl &&
							outputData[supportVersion][idx].appUrl == thisEvent.appUrl
						){
							isDuplicate = true;
							break;
						}
					}
				}

				if(isDuplicate) return true;
			}
			catch(e){
				outputData[supportVersion] = new Array;
			}

			csv()
				.fromFile(csvDescFilePath)
				.on('json', (jsonObj) => {
					if(jsonObj.field1 == 'Notification text'){
						for(var lang in LangTable){
							thisEvent.desc[lang] = jsonObj[LangTable[lang]];
						}
					}
					else if(jsonObj.field1 == 'Title'){
						for(var lang in LangTable){
							thisEvent.title[lang] = jsonObj[LangTable[lang]];
						}
					}
				})
				.on('done', () => {						
					outputData[supportVersion].push(thisEvent);
					jsonfile.writeFile(outputFile, outputData, {spaces: 4, EOL: '\r\n'}, function(){})
				})
			})
	})
	.on('done', () => {
		// run tester
	})