import markdown from "remark-parse";
import stringify from "remark-stringify";
import visit from "unist-util-visit";
import { Node } from "unist";
import builder from "unist-builder";

import unified from "unified";

/**
 * @class Class representing a parsed document for searching.
 */
export class Extractor {
  parserSettings: {};
  stringifySettings: {};
  document: String;

  // TODO: Improve defaults handling based on https://github.com/remarkjs/remark/issues/452
  /**
   * Creates an instance of the Chapter extractor
   * @param {string} document The document to be searched.
   */
  constructor(
    document: String,
    parserSettings: {} = {},
    stringifySettings: {} = {},
  ) {
    this.document = document;
    this.parserSettings = parserSettings;
    this.stringifySettings = stringifySettings;
  }

  /**
   * Searches a document for a heading that matches the headingText.
   *
   * @param {string} headingText Text to be matched in the heading.
   * @param {number} headingLevel Level at which the heading resides in Markdown.
   * @param {boolean} exact Should the text be matched exactly or search for contains.
   */
  public find(
    headingText: string,
    headingLevel: number,
    exact: boolean = false,
  ): string {
    var processor = unified()
      .use(markdown, this.parserSettings)
      .use(() => {
        return (tree) => {
          var append = false;
          var startNode: Node;
          var startLevel = -1;
          var nodes: Node[] = [];
          visit(tree, (node) => {
            console.log(node);
            if (node.type === "heading") {
              if (!startNode) {
                if (
                  typeof node.depth === "number" &&
                  (headingLevel === 0 || node.depth === headingLevel)
                ) {
                  if (node.children instanceof Array) {
                    if (node.children[0].value === headingText) {
                      startNode = node;
                      nodes.push(node);
                      startLevel = node.depth;
                      append = true;
                    }
                  }
                }
              } else {
                if (
                  typeof node.depth === "number" &&
                  node.depth <= startLevel
                ) {
                  append = false;
                }
              }
            } else {
              if (append) {
                nodes.push(node);
              }
            }
          });
          console.log(builder("root", nodes));
          console.log(tree);
          return builder("root", nodes);
        };
      })
      .use(stringify, this.stringifySettings);

    processor.process(this.document, (err, file) => {
      if (err) {
        console.log(err);
      }
      console.log(String(file));
    });
    console.log(
      `Searching for ${headingText} at level ${headingLevel} ${exact}`,
    );
    return "";
  }
}
