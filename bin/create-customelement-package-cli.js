#!/usr/local/bin/node
"use strict";

var fs = require("fs"),
	npm = require("npm"),
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
	packagePackageJsonFile = packageDirectory + "package.json",
	templateDirectory = ".." + path.sep + "template" + path.sep,
	templateIndexFile = templateDirectory + "index.html",
	templateServerFile = templateDirectory + "server.js",
	templatePackageJsonFile = templateDirectory + "package.json";

console.info("Creating the custom element package,", packageName);

fs.mkdirSync(packageName);
fs.mkdirSync(packageSrcDirectory);

var templateIndexFileReadStream = fs.createReadStream(templateIndexFile),
	packageIndexFileWriteStream = fs.createWriteStream(packageIndexFile),
	templateServerFileReadStream = fs.createReadStream(templateServerFile),
	packageServerFileWriteStream = fs.createWriteStream(packageServerFile),
	templatePackageJsonFileReadStream = fs.createReadStream(templatePackageJsonFile),
	packagePackageJsonFileWriteStream = fs.createWriteStream(packagePackageJsonFile);

templateIndexFileReadStream.pipe(packageIndexFileWriteStream);
templateServerFileReadStream.pipe(packageServerFileWriteStream);
templatePackageJsonFileReadStream.pipe(packagePackageJsonFileWriteStream);

npm.load(function(err, npm) {
	npm.config.set("save", true);

	npm.commands.install(packageName, ["es6-module-loader", "traceur"], function() {
		npm.config.set("save-dev", true);
		
		npm.commands.install(packageName, ["node-static"], function() {
			npm.prefix = process.cwd() + path.sep + packageName;
			
			console.log("prefix = %s", npm.prefix);
			
			npm.commands.dedupe();
		});
	});
});
