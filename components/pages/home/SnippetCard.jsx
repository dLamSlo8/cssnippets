import { useState } from 'react';
import Link from 'next/link';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import ArrowRightIcon from '@media/arrow-right-icon.svg';
import InformationIcon from '@media/information-icon.svg';
import ExternalLinkIcon from '@media/external-link-icon.svg';
import CloseIcon from '@media/close-icon.svg';

// TODO add tippy to hover link and hover information icon
// TODO figure out a way to add hover effect for both border and header!
// TODO add reference property to settings.json for snippets, consume here
// TODO add UserSettingsContext for user settings dealing with dark mode and prefers-reduced-motion (and high contrast?)
export default function SnippetCard({ snippet: { name, topicsDiscussed, reference, html, css }}) {
    const [overlayShown, setOverlayShown] = useState(null);

    return (
        <div className="c-snippet-card">
            {/* DOM order should begin with header for accessibility, but since it's visually positioned as footer, use flex column-reverse */}
            <header> 
                <Link href="/">
                    <a className="c-snippet-card__link">
                        <h3>{name}</h3>
                        <ArrowRightIcon width="18" height="18" />
                    </a>
                </Link>
            </header>
            <div className="c-snippet-card__snippet">
                {/* 
                    We specifically set transform to translate(0) (or really any value other than none) 
                    to handle the case where we have a fixed element. This is because when we have a transform
                    set to a non-none value, the element becomes the containing block for the fixed element!
                */}
                <div style={{transform: "translate(0)"}} dangerouslySetInnerHTML={{__html: `
                    <div>
                        ${css ? (`
                            <style scoped>
                                ${css}
                            </style>
                        `) : ''}
                        ${html}
                    </div>
                `}} />
                {
                    overlayShown && (
                        <SwitchTransition>
                            <CSSTransition
                            key={overlayShown}
                            classNames="fade"
                            appear
                            timeout={200}>
                                <div className="c-snippet-card__overlay">
                                {
                                    overlayShown === 'topics' ? (
                                        <>
                                            <h3 className="u-font-md xs:u-font-lg">Topics Discussed</h3>
                                            <ul className="l-snippet-card__topic-list">
                                            {
                                                topicsDiscussed.map((topic) => (
                                                    <li key={topic} className="c-snippet-card__topic">{topic}</li>
                                                ))
                                            }
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="u-font-lg">Reference</h3>
                                            <p className="u-mt-3">Helo World!</p>
                                        </>
                                    )
                                }
                                </div>
                            </CSSTransition>
                        </SwitchTransition>
                    )
                }
                <div className="l-snippet-card__toggles">
                    <button onClick={() => overlayShown === 'reference' ? setOverlayShown(null) : setOverlayShown('reference')}>
                        {overlayShown === 'reference' ? <CloseIcon width="24" height="24" /> : <ExternalLinkIcon width="24" height="24" />}
                    </button>
                    <button onClick={() => overlayShown === 'topics' ? setOverlayShown(null) : setOverlayShown('topics')}>
                        {overlayShown === 'topics' ? <CloseIcon width="24" height="24" /> : <InformationIcon width="24" height="24" />}
                    </button>
                </div>

            </div>
        </div>
    )
}