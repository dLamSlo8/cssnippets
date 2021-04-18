import fs from 'fs';
import path from 'path';
import remark from 'remark';
import remarkHTML from 'remark-html';

const snippetsDirectory = path.join(process.cwd(), 'snippets');
const names = fs.readdirSync(snippetsDirectory);

function readSnippet(snippetFolder) {
    const files = fs.readdirSync(snippetFolder);
    let snippetObj = {};

    for (let file of files) {
        if (file === 'explanations') { // Don't want to handle the explanation process here. Only useful in [snippet].js
            continue ;
        }
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


    return snippetObj;
}

async function readSnippetWithExplanations(snippetFolder) {
    let snippetObj = readSnippet(snippetFolder);
    const explanationPath = path.join(snippetFolder, 'explanations');
    let explanationObj = await transformExplanationMd(explanationPath);
    let cssLines = snippetObj.css.split('\n');
    let css = cssLines.map((cssLine, idx) => ({
        line: cssLine,
        explanation: explanationObj[idx] ?? null
    }));

    return { ...snippetObj, css };
}

/**
 * Transforms all MD files within the snippet's explanations folder
 * to JSX. This currently ASSUMES NO FRONT-MATTER, CHANGE IF NECESSARY.
 * @param {String} explanationPath Path to the snippet's explanations folder
 * @returns An object whose properties represent the line of CSS, and whose value represents the
 *          explanation in JSX form.
 */
async function transformExplanationMd(explanationPath) {
    const fileNames = fs.readdirSync(explanationPath);
    let resObj = {};

    for (let fileName of fileNames) {
        const regex = /^([0-9+]).md$/;
        const matches = fileName.match(regex);

        if (!matches) {
            throw new Error(`${fileName} is the incorrect file format. Requires MDX file whose filename is a number.`);
        }

        const cssIdx = parseInt(matches[1]);
        const mdFileContents = fs.readFileSync(path.join(explanationPath, fileName), 'utf8');
        resObj[cssIdx] = await (await remark().use(remarkHTML).process(mdFileContents)).toString();
    }

    return resObj;
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

export async function getSnippet(snippetName) {
    const snippetFolder = path.join(snippetsDirectory, snippetName);

    return await readSnippetWithExplanations(snippetFolder);
}

export function getSnippetNames() {
    return names;
}