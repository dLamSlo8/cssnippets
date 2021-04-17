import { useState, useLayoutEffect } from 'react';
import Prism from 'prismjs';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';

import QuestionIcon from '@media/question-icon.svg';
import ClipboardIcon from '@media/clipboard-icon.svg';
import ExpandIcon from '@media/expand-icon.svg';

export default function SnippetInteractiveSection({ html, css }) {
    const [viewMode, setViewMode] = useState('explanation');
    const [codeMode, setCodeMode] = useState('html');

    const htmlButtonClasses = classNames('snippet-c-language-button', {
        'snippet-c-language-button--active': codeMode === 'html'
    });
    const cssButtonClasses = classNames('snippet-c-language-button', {
        'snippet-c-language-button--active': codeMode === 'css'
    });

    /* 
        Effect:
        Highlights code on mount.
        We're specifically opting for useLayoutEffect
        to ensure that the highlighting ships with the DOM update, rather than 
        after the paint, so there's no flash of unstyled text!
        If we were to use useEffect, this highlighting would be done after the layout 
        and paint.
    */
    useLayoutEffect(() => {
        Prism.highlightAll();
    }, [codeMode]);

    return (
        <section className="snippet-l-interactive-section">
            {/* Top bar */}
            <header className="l-stack-inline-3">
                <button className={htmlButtonClasses} onClick={() => setCodeMode('html')}>HTML</button>
                <button className={cssButtonClasses} onClick={() => setCodeMode('css')}>CSS</button>
                {/* View Mode Component */}
                
                {/* Icons */}
                <div className="l-stack-inline-5 u-self-center u-ml-auto">
                    <Tippy content="How to Use" theme="primary">
                        <button>
                            <QuestionIcon width="24" height="24" />
                        </button>
                    </Tippy>
                    <Tippy content={`Copy ${codeMode.toUpperCase()} to Clipboard`} theme="primary">
                        <button>
                            <ClipboardIcon width="24" height="24" />
                        </button>
                    </Tippy>
                    <Tippy content="Expand to Fullscreen" theme="primary">
                        <button>
                            <ExpandIcon width="24" height="24" />
                        </button>
                    </Tippy>
                </div>
            </header>
            {/* Main content (where code should go) */}
            <div>
                <pre className="snippet-l-code" tabIndex="0">
                    <code className={`language-${codeMode}`}>
                        {codeMode === 'css' ? css : html}
                    </code>
                </pre>
            </div>
        </section>        
    )
}