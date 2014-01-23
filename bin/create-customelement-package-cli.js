#!/usr/local/bin/node
"use strict";

var fs = require("fs"),
	npm = require("npm"),
	path = require("path"),
	Replacer = require("replacer");

verifyCorrectCommandUsage();

var packageName = process.argv[2],
	packageDirectory = packageName + path.sep,
	packageSrcDirectory = packageDirectory + "src",
	templateDirectory = ".." + path.sep + "template" + path.sep;

console.info("Creating the custom element package,", packageName);

fs.mkdirSync(packageName);
fs.mkdirSync(packageSrcDirectory);

copyFileFromTemplateToNewlyCreatedPackageAndTransform("server.js", new Replacer("PCK-NAME", packageName));
copyFileFromTemplateToNewlyCreatedPackageAndTransform("README.md", new Replacer("PCK-NAME", packageName));
copyFileFromTemplateToNewlyCreatedPackageAndTransform("index.html", new Replacer("PCK-NAME", packageName));
copyFileFromTemplateToNewlyCreatedPackageAndTransform("package.json", new Replacer("PCK-NAME", packageName));

npm.load(npmLoaded);

function verifyCorrectCommandUsage() {
	if(process.argv.length < 3) {
		console.error("Usage: create-customelement-package <customelement-package-name>");

		process.exit(1);
	}
}

function copyFileFromTemplateToNewlyCreatedPackageAndTransform(fileName, transformStream) {
	var packageFile = packageDirectory + fileName,
		templateFile = templateDirectory + fileName,
		templateFileReadStream = fs.createReadStream(templateFile),
		packageFileWriteStream = fs.createWriteStream(packageFile);

	templateFileReadStream.pipe(transformStream).pipe(packageFileWriteStream);
};

function npmLoaded(err, npm) {
	npm.config.set("save", true);

	npm.commands.install(packageName, ["es6-module-loader", "traceur"], dependenciesInstalled);
};

function dependenciesInstalled() {
	npm.config.set("save-dev", true);
	
	npm.commands.install(packageName, ["node-static"]);
};
