import { Parser } from "commonmark";
import * as fs from "fs";
import * as path from "path";

fs.readFile(path.join(".", "CHANGELOG.md"), "utf-8", (err, data) => {
  if (err) throw err;
  var reader = new Parser();
  var parsed = reader.parse(data);
  console.log(data);
  var walker = parsed.walker();
  var walterEvent;
  while ((walterEvent = walker.next())) {
    var node = walterEvent.node;
    if (walterEvent.entering) {
      //console.log(node);
      if (node.type === "heading") {
        if (node.firstChild) {
          console.log(node.firstChild.literal);
        }
        console.log(node.level);
      }
    }
  }
});
