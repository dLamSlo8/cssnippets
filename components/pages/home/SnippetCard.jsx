import { useState } from 'react';
import Link from 'next/link';

import ArrowRightIcon from '@media/arrow-right-icon.svg';
import InformationIcon from '@media/information-icon.svg';
import CloseIcon from '@media/close-icon.svg';

// TODO install classnames
export default function SnippetCard({ snippet: { name, topicsDiscussed, html, css }}) {
    const [showTopics, setShowTopics] = useState(false);

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
                        <style scoped>
                            ${css}
                        </style>
                        ${html}
                    </div>
                `}} />
                <div className={`c-snippet-card__topics-overlay ${showTopics ? 'c-snippet-card__topics-overlay--active' : ''}`}>
                    <h3 className="u-font-lg">Topics Discussed</h3>
                    <ul className="l-snippet-card__topic-list">
                    {
                        topicsDiscussed.map((topic) => (
                            <li className="c-snippet-card__topic">{topic}</li>
                        ))
                    }
                    </ul>
                </div>
                <button className="c-snippet-card__topics-toggle" onClick={() => setShowTopics((showTopics) => !showTopics)}>
                    {showTopics ? <CloseIcon width="30" height="30" /> : <InformationIcon width="30" height="30" />}
                </button>
            </div>
        </div>
    )
}