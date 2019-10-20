import { Parser, Node } from "commonmark";

/**
 * @class Class representing a parsed document for searching.
 */
export class Extractor {
  documentNode: Node;

  /**
   * Creates an instance of the Chapter extractor
   * @param {string} document The document to be searched.
   */
  constructor(document: string) {
    var reader = new Parser();
    this.documentNode = reader.parse(document);
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
    var walker = this.documentNode.walker();
    var walkerEvent;
    while ((walkerEvent = walker.next())) {
      var node = walkerEvent.node;
      if (walkerEvent.entering) {
        //console.log(node);
        if (node.type === "heading" && node.level === headingLevel) {
          if (node.firstChild) {
            console.log(node.firstChild.literal);
            if (exact) {
              if (node.firstChild.literal === headingText) {
                console.log("Found");
              }
            } else {
              if (
                node.firstChild.literal &&
                node.firstChild.literal.includes(headingText)
              ) {
                console.log("Found");
              }
            }
          }
          console.log(node.level);
        }
      }
    }
    return "";
  }
}
