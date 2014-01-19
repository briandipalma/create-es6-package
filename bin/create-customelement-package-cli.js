#!/usr/local/bin/node
"use strict";

var fs = require("fs"),
	path = require("path");

if(process.argv.length < 3) {
	console.error("Usage: create-customelement-package <customelement-package-name>");

	process.exit(1);
}

var packageName = process.argv[2],
	packageDirectory = packageName + path.sep,
	packageSrcDirectory = packageDirectory + "src",
	packageIndexFile = packageDirectory + "index.html",
	packageServerFile = packageDirectory + "server.js",
	templateDirectory = ".." + path.sep + "template" + path.sep,
	templateIndexFile = templateDirectory + "index.js",
	templateServerFile = templateDirectory + "server.js";

console.info("Creating the custom element package,", packageName);

fs.mkdirSync(packageName);
fs.mkdirSync(packageSrcDirectory);

var templateIndexFileReadStream = fs.createReadStream(templateIndexFile),
	packageIndexFileWriteStream = fs.createWriteStream(packageIndexFile),
	templateServerFileReadStream = fs.createReadStream(templateServerFile),
	packageServerFileWriteStream = fs.createWriteStream(packageServerFile);

templateIndexFileReadStream.pipe(packageIndexFileWriteStream);
templateServerFileReadStream.pipe(packageServerFileWriteStream);

//Needed files: package.json
