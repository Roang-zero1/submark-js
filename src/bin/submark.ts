#!/usr/bin/env node

import { readFileSync, existsSync } from "fs";
import commander from "commander";

var program = new commander.Command();

var filename: any;
var headingText: any;
var headingLevel: any;

program
  .version("1.0.0")
  .description("Extract a part of a CommonMark/Markdown document");

program
  .option("-e, --exact", "Search for the exact heading text.", false)
  .option("--encoding <encoding>", "Encoding of the file read.", "utf-8");

program
  .arguments("<filename> <headingText> [headingLevel]")
  .action((filenameArg, headingTextArg, headingLevelArg) => {
    filename = filenameArg;
    headingText = headingTextArg;
    headingLevel = headingLevelArg;
  });

program.parse(process.argv);

if (
  filename === undefined ||
  typeof filename !== "string" ||
  !existsSync(filename)
) {
  console.error("Please provide a valid filename.");
  program.help();
}

if (headingText === undefined || typeof headingText !== "string") {
  console.error("Please provide a valid heading text to search for.");
  program.help();
}

if (headingLevel === undefined) {
  headingLevel = 0;
} else {
  headingLevel = Number(headingLevel);
  if (isNaN(headingLevel)) {
    console.error("Heading level must be a number.");
    program.help();
  } else if (!Number.isInteger(headingLevel)) {
    console.error("Heading level must be an integer.");
    program.help();
  } else if (headingLevel < 1 || headingLevel > 6) {
    console.error("Heading level must be between 1 and 6.");
    program.help();
  }
}

if (typeof program.encoding !== "string") {
  console.error("Invalid encoding specified.");
  program.help();
}

var fileContent: string;
try {
  fileContent = readFileSync(filename, String(program.encoding));
  console.log(`Read file: ${fileContent}`);
  //TO-DO: Add extractor functionality
} catch (error) {
  if (error.code === "ERR_INVALID_OPT_VALUE_ENCODING") {
    console.error("Invalid file encoding chosen.");
    program.help();
  }
  console.error("Failed to load file content");
  process.exit(1);
}
