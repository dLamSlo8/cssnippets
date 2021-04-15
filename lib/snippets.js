import fs from 'fs';
import path from 'path';

const snippetsDirectory = path.join(process.cwd(), 'snippets');

/**
 * Parses all files in snippets folder and compiles them into a single object.
 * @returns Array of snippet objects containing name, topics, html, css
 */
export default function getSnippets() {
    const names = fs.readdirSync(snippetsDirectory);
    let snippets = [];

    for (let name of names) {
        const snippetFolder = path.join(snippetsDirectory, name);
        const files = fs.readdirSync(snippetFolder);
        let snippetObj = {};

        for (let file of files) {
            const filePath = path.join(snippetFolder, file);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            console.log(fileContents);
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

        snippets.push(snippetObj);
    }

    return snippets;
}