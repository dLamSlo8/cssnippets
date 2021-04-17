import fs from 'fs';
import path from 'path';

const snippetsDirectory = path.join(process.cwd(), 'snippets');
const names = fs.readdirSync(snippetsDirectory);

function readSnippet(snippetFolder) {
    const files = fs.readdirSync(snippetFolder);
    let snippetObj = {};

    for (let file of files) {
        const filePath = path.join(snippetFolder, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');

        if (file === 'metadata.json') {
            let metadataJSON = JSON.parse(fileContents);
            
            snippetObj = { ...snippetObj, ...metadataJSON };
        }
        else if (file === 'index.html') {
            snippetObj['html'] = fileContents;
        }
        else if (file === 'style.css') {
            snippetObj['css'] = fileContents;
        }
    }

    console.log(snippetObj);

    return snippetObj;
}
/**
 * Parses all files in snippets folder and compiles them into a single object.
 * @returns Array of snippet objects containing name, topics, html, css
 */
export default function getSnippets() {
    let snippets = [];

    for (let name of names) {
        const snippetFolder = path.join(snippetsDirectory, name);

        snippets.push({ ...readSnippet(snippetFolder), slug: name });
    }

    return snippets;
}

export function getSnippet(snippetName) {
    const snippetFolder = path.join(snippetsDirectory, snippetName);
    console.log(snippetName);
    return readSnippet(snippetFolder);
}

export function getSnippetNames() {
    return names;
}