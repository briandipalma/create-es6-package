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
	templateDirectory = ".." + path.sep + "template" + path.sep;

console.info("Creating the custom element package,", packageName);

fs.mkdirSync(packageName);
fs.mkdirSync(packageSrcDirectory);

copyFileFromTemplateToNewlyCreatedPackage("server.js");
copyFileFromTemplateToNewlyCreatedPackage("index.html");
copyFileFromTemplateToNewlyCreatedPackage("package.json");

npm.load(npmLoaded);

function copyFileFromTemplateToNewlyCreatedPackage(fileName) {
	var packageFile = packageDirectory + fileName,
		templateFile = templateDirectory + fileName,
		templateFileReadStream = fs.createReadStream(templateFile),
		packageFileWriteStream = fs.createWriteStream(packageFile);
	
	templateFileReadStream.pipe(packageFileWriteStream);
};

function npmLoaded(err, npm) {
	npm.config.set("save", true);

	npm.commands.install(packageName, ["es6-module-loader", "traceur"], dependenciesInstalled);
};

function dependenciesInstalled() {
	npm.config.set("save-dev", true);
	
	npm.commands.install(packageName, ["node-static"]);
};
