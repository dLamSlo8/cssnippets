// import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Tippy from '@tippyjs/react';
import classNames from 'classnames';

import { getSnippet, getSnippetNames } from '@lib/snippets';

import useMediaQuery from '@hooks/useMediaQuery';

import ResizableSplitColumns from '@components/ResizableSplitColumns';
import SnippetVisual from '@components/SnippetVisual';
import SnippetInteractiveSection from '@components/pages/snippet/SnippetInteractiveSection';

import InformationIcon from '@media/information-icon.svg';
import CloseIcon from '@media/close-icon.svg';

export default function SnippetPage({ snippet: { html, css, name, topicsDiscussed, reference: { link: { isUrl, title }, context } } }) {
    const containerRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [referenceContextShown, setReferenceContextShown] = useState(false);
    const [fullWidth, setFullWidth] = useState(null);
    const isDesktop = useMediaQuery('(min-width: 750px)');

    const referenceLinkClasses = classNames('u-font-md sm:u-font-lg', {
        'snippet-c-reference-link': isUrl
    });

    const pureCSS = useMemo(() => {
        return css.reduce((acc, cssObj) => acc + `${cssObj.line}\n`, '');
    }, []);

    /* 
        Effect:
        Sets mounted state. Necessary to get immediate value of containerRef 
        and its ref for ResizableSplitColumns. Avoids complex logic within
        ResizableSplitColumns to account for delayed ref values.
    */
    useEffect(() => {
        setMounted(true);
    }, []);

    
    useEffect(() => {
        setFullWidth(containerRef.current.offsetWidth);

        window.addEventListener('resize', handleResize);

        function handleResize(e) {
            setFullWidth(containerRef.current.offsetWidth);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <div className="l-container l-stack-block-8">
            <header className="l-stack-block-8">
                <div className="l-stack-inline-3 snippet-l-top-header">
                    <div>
                        <p className="u-color-gray-dark u-font-bold">Snippet</p>
                        <h1 className="u-font-lg sm:u-font-xl">{name}</h1>
                    </div>
                    <section className="lg:u-ml-auto">
                        <header className="snippet-l-reference-section">
                            <div className="l-stack-inline-5">
                                <p className="u-color-gray-dark u-font-bold">Reference</p>
                                <Tippy 
                                content={
                                    <section className="snippet-c-reference-context l-stack-block-2">
                                        <header className="l-stack-inline-3 u-justify-between u-align-center">
                                            <h2 className="u-font-lg">Context</h2>
                                            <button onClick={() => setReferenceContextShown(false)}>
                                                <CloseIcon width="24" height="24" className="u-color-white" />
                                            </button>
                                        </header>
                                        <p>{context}</p>
                                    </section>
                                } 
                                visible={referenceContextShown} 
                                onClickOutside={() => setReferenceContextShown(false)}
                                interactive={true}>
                                    <Tippy content="Show Context" theme="primary" disabled={referenceContextShown}>
                                        <button className="lg:u-ml-auto" onClick={() => setReferenceContextShown((referenceContextShown) => !referenceContextShown)}>
                                            <InformationIcon width="24" height="24" />
                                        </button>
                                    </Tippy>
                                </Tippy>
                            </div>
                            <h2 className={referenceLinkClasses}>
                            {
                                isUrl ? <a href={title} target="_blank" rel="noopener noreferrer">{title}</a> : title
                            }
                            </h2>
                        </header>
                    </section>
                </div>
                <section>
                    <header>
                        <p className="u-color-gray-dark u-font-bold">Topics Discussed</p>
                    </header>
                    <ul className="snippet-l-topics">
                    {
                        topicsDiscussed.map((topic) => (
                            <li className="snippet-c-topic">{topic}</li>
                        ))
                    }
                    </ul>
                </section>
            </header>
            <main className="l-stack-block-5">
                <div className="u-flex" ref={containerRef}>
                {
                    mounted && isDesktop &&  (
                        <ResizableSplitColumns 
                        fullWidth={fullWidth} 
                        dividerWidth={5}
                        gapWidth={16}
                        leftMinWidth={200}
                        rightMinWidth={300}>
                            <div className="snippet-c-visual">
                                <SnippetVisual 
                                html={html}
                                css={pureCSS} />
                            </div>
                            <SnippetInteractiveSection html={html} css={css} pureCSS={pureCSS} />
                        </ResizableSplitColumns>
                    )
                }
                </div>
                {
                    !isDesktop && (
                        <div className="l-stack-block-5">
                            <div className="snippet-c-visual snippet-c-visual--mobile">
                                <SnippetVisual html={html} css={pureCSS} />
                            </div>
                            <SnippetInteractiveSection html={html} css={css} />
                        </div>
                    )
                }
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
    let snippet = await getSnippet(params.snippet);

    return {
        props: {
            snippet
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