// import { useRouter } from 'next/router';

import { getSnippet, getSnippetNames } from '@lib/snippets';

import ResizableSplitColumns from '@components/ResizableSplitColumns';
import SnippetVisual from '@components/SnippetVisual';
import SnippetInteractiveSection from '@components/pages/snippet/SnippetInteractiveSection';

export default function SnippetPage({ snippet }) {
    
    return (
        <div className="l-container">
            <h1>{snippet.name}</h1>
            <main className="snippet-l-main-columns">
                <ResizableSplitColumns>
                    <div style={{backgroundColor: 'red'}}>
                        <SnippetVisual />
                    </div>
                    <SnippetInteractiveSection />
                </ResizableSplitColumns>
            </main>
        </div>
    )
}

export async function getStaticProps({ params }) {
    return {
        props: {
            snippet: getSnippet(params.snippet)
        }
    }
}

export async function getStaticPaths() {
    const paths = getSnippetNames();

    return {
        paths: paths.map((pathName) => ({ params: { snippet: pathName }})),
        fallback: false
    };   
}