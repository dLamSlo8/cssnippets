// import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { getSnippet, getSnippetNames } from '@lib/snippets';

import ResizableSplitColumns from '@components/ResizableSplitColumns';
import SnippetVisual from '@components/SnippetVisual';
import SnippetInteractiveSection from '@components/pages/snippet/SnippetInteractiveSection';

export default function SnippetPage({ snippet: { html, css, name } }) {
    const containerRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="l-container" >
            <h1>{name}</h1>

            <main className="snippet-l-main-columns" ref={containerRef}>
            {
                mounted && (
                    <ResizableSplitColumns fullWidth={containerRef.current.offsetWidth} leftMinWidth={200}>
                        <div className="snippet-l-left-column">
                            <SnippetVisual 
                            html={html}
                            css={css} />
                        </div>
                        <SnippetInteractiveSection />
                    </ResizableSplitColumns>
                )
            }
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