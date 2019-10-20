#!/usr/bin/env node

import commander from "commander";

var program = new commander.Command();

program
  .version("1.0.0")
  .description("Extract a part of a CommonMark/Markdown document");
program
  .option("-e, --exact", "Search for the exact heading text.", false)
  .option("-l, --headingLevel", "Markdown heading level to search at.")
  .arguments("<filename> <headingText>")
  .action(function(filename, headingText) {
    //TO-DO: parse these values
    console.log(filename);
    console.log(headingText);
  });

program.parse(process.argv);
