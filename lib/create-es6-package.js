"use strict";

var packageName = {},
	fs = require("fs"),
	npm = require("npm"),
	path = require("path"),
	program = require("commander"),
	Replacer = require("replacer"),
	templateDirectory = path.join(__dirname, "..", "template");

function parseArgumentsAndCreatePackage(args) {
	program.
		version("0.0.0").
		usage("<package name>").
		parse(args);

	if(args[2] === undefined) {
		program.help();
	}

	packageName = args[2];

	createPackageDirectoriesAndFiles(packageName);
	npm.load(npmLoaded);
};

function createPackageDirectoriesAndFiles(packageName) {
	var packageDirectory = path.join(process.cwd(), packageName),
		packageSrcDirectory = path.join(packageDirectory, "src");

	fs.mkdirSync(packageDirectory);
	fs.mkdirSync(packageSrcDirectory);

	copyFileFromTemplateToNewlyCreatedPackageAndTransform("server.js", new Replacer("PCK-NAME", packageName), packageDirectory);
	copyFileFromTemplateToNewlyCreatedPackageAndTransform("README.md", new Replacer("PCK-NAME", packageName), packageDirectory);
	copyFileFromTemplateToNewlyCreatedPackageAndTransform("index.html", new Replacer("PCK-NAME", packageName), packageDirectory);
	copyFileFromTemplateToNewlyCreatedPackageAndTransform("package.json", new Replacer("PCK-NAME", packageName), packageDirectory);
};

function copyFileFromTemplateToNewlyCreatedPackageAndTransform(fileName, transformStream, packageDirectory) {
	var packageFile = path.join(packageDirectory, fileName),
		templateFile = path.join(templateDirectory, fileName),
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

module.exports = parseArgumentsAndCreatePackage;
