// import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { getSnippet, getSnippetNames } from '@lib/snippets';

import useMediaQuery from '@hooks/useMediaQuery';

import ResizableSplitColumns from '@components/ResizableSplitColumns';
import SnippetVisual from '@components/SnippetVisual';
import SnippetInteractiveSection from '@components/pages/snippet/SnippetInteractiveSection';

export default function SnippetPage({ snippet: { html, css, name, topicsDiscussed } }) {
    const containerRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 450px)');

    /* 
        Effect:
        Sets mounted state. Necessary to get immediate value of containerRef 
        and its ref for ResizableSplitColumns. Avoids complex logic within
        ResizableSplitColumns to account for delayed ref values.
    */
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="l-container l-stack-block-5">
            <header className="l-stack-inline-3 u-align-baseline">
                <div>
                    <p className="u-color-gray-dark u-font-bold">Snippet</p>
                    <h1 className="u-font-xl">{name}</h1>
                </div>
                <div className="u-ml-auto l-stack-inline-5">
                    <section>
                        <header className="snippet-l-reference-section">
                            <p className="u-color-gray-dark u-font-bold">Reference</p>
                            <h2 className="u-font-lg">Reference Name</h2>
                        </header>
                    </section>
                    <section>
                        <header>
                            <p className="u-color-gray-dark u-font-bold">Topics Discussed</p>
                        </header>
                        <ul className="l-stack-inline-2 u-align-center snippet-l-topics">
                        {
                            topicsDiscussed.map((topic) => (
                                <li className="snippet-c-topic">{topic}</li>
                            ))
                        }
                        </ul>
                    </section>
                </div>
            </header>
            <main className="l-stack-block-5">
                <div className="snippet-l-main-columns" ref={containerRef}>
                {
                    mounted && isDesktop &&  (
                        <ResizableSplitColumns fullWidth={containerRef.current.offsetWidth} leftMinWidth={200}>
                            <div className="snippet-c-left-column">
                                <SnippetVisual 
                                html={html}
                                css={css} />
                            </div>
                            <SnippetInteractiveSection html={html} css={css} />
                        </ResizableSplitColumns>
                    )
                }
                </div>
                <h2>Extra Thoughts</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum, maiores nihil sit odit sequi illum at odio atque eligendi architecto voluptatum tempore, tenetur dolores inventore veniam explicabo, voluptate veritatis accusantium?</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga ea ratione assumenda quisquam maiores pariatur, ipsam velit cumque. Quos amet magnam beatae voluptas a expedita, assumenda obcaecati ratione et quisquam.</p>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis sequi quam officia eveniet laudantium dolorum reprehenderit iure doloribus quibusdam nesciunt, voluptatum voluptatibus ullam quae id consequatur minus, hic quo. Earum.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique reiciendis sit laboriosam sunt tempora alias consequatur. Similique veritatis vitae, qui sint praesentium quisquam quas quae, quasi porro cumque ut saepe!</p>
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