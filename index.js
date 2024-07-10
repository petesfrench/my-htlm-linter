#!/usr/bin/env node

const fs = require('fs');
const parse5 = require('parse5');

// This finds any 'alt' attribute in the HTML. 
const altRegex = /alt\s*=\s*"(.*?)"/g;

// These are rules for 'lintHTMLNodes' function
const rules = {
  imgAltAttribute: (node, location) => {
    if (node.tagName === 'img' && !node.attrs.some(attr => attr.name === 'alt')) {
      console.log(`Line ${location.startLine}: Missing alt attribute on <img>`);
    }
  },
  checkTextContent: (node, location) => {
    if (node.nodeName === '#text') {
      const text = node.value;
      const parentNode = node.parentNode;
      const index = parentNode.childNodes.indexOf(node);
      
      // Check for leading or trailing spaces next to <span> tags
      const prevSibling = parentNode.childNodes[index - 1];
      const nextSibling = parentNode.childNodes[index + 1];
      const isPrevSpan = prevSibling && prevSibling.tagName === 'span';
      const isNextSpan = nextSibling && nextSibling.tagName === 'span';

      if (!text.includes('\n')) {
        if (text.includes('  ')) {
          console.log(`Line ${location.startLine}: Double space found in text node.`);
        }
        if (text.trim() !== text) {
          if (!isPrevSpan && !isNextSpan) {
            console.log(`Line ${location.startLine}: Leading or trailing space found in text node (maybe, this check seems to be wrong with spans)`);
          }
        }
      }
    }
  }
};

// This runs specifically on HTML nodes
const lintHTMLNodes = (html) => {
  const document = parse5.parse(html, { sourceCodeLocationInfo: true });

  const traverse = (node, location) => {
    if (node.tagName) {
      for (const rule in rules) {
        rules[rule](node, location);
      }
    }

    if (node.childNodes) {
      for (const childNode of node.childNodes) {
        childNode.parentNode = node; // Add reference to parent node
        traverse(childNode, childNode.sourceCodeLocation || location);
      }
    } else if (node.nodeName === '#text') {
      rules.checkTextContent(node, location);
    }
  };

  traverse(document, document.sourceCodeLocation);
};

// This runs on the entire HTML string
const lintHTMLString = (html) => {
  let match;
  while ((match = altRegex.exec(html)) !== null) {
    const line = html.substring(0, match.index).split("\n").length;
    const altValue = match[1];
    if (altValue === '') {
      console.log(`Line ${line}: Empty alt attribute found on image_template`);
    } else if (altValue[0] !== altValue[0].toUpperCase()) {
      console.log(`Line ${line}: Alt attribute "${altValue}" should start with a capital letter in image_template`);
    }
  }
};

// Check the file exists
const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide an HTML file to lint. Check the path is correct.');
  process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf8');
lintHTMLNodes(html);
lintHTMLString(html);
