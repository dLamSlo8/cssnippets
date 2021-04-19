import { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import Prism from 'prismjs';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';

import InteractiveCSSLine from './InteractiveCSSLine';

import QuestionIcon from '@media/question-icon.svg';
import ClipboardIcon from '@media/clipboard-icon.svg';
import ExpandIcon from '@media/expand-icon.svg';
import CSSLine from './CSSLine';

// TODO Fix issue with React event thing? (with  Prism and <code>)
// TODO Add touch events to divider (to account for touch devices like tablets and landscape-oriented phones!)
export default function SnippetInteractiveSection({ html, css, pureCSS, ...propagated }) {
    const [viewMode, setViewMode] = useState('explanation');
    const [codeMode, setCodeMode] = useState('css');
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    const htmlButtonClasses = classNames('snippet-c-language-button', {
        'snippet-c-language-button--active': codeMode === 'html'
    });
    const cssButtonClasses = classNames('snippet-c-language-button', {
        'snippet-c-language-button--active': codeMode === 'css'
    });

    /**
     * Copies CSS/HTML (depending on codeMode) to clipboard.
     */
    const handleCopy = (e) => {
        navigator.clipboard.writeText(codeMode === 'css' ? pureCSS : html).then(function() {
            setCopied(true);
        })
    };

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
        console.log('in layout effect');
        if (mounted) {
            Prism.highlightAll();
        }
    }, [codeMode, mounted]);

    /* 
        Effect:
        We go through this specific process of making sure the component is mounted for the
        useLayoutEffect hook above. This is because of how rehydration, the process of
        making the site dynamic and attaching React to it on load, expects the same DOM in
        the first mount as the server-rendered HTML.
        
        Because Prism.highlightAll() will update the DOM to include the appropriate code
        classes, the server-rendered HTML will effectively be different from the DOM after the 
        initial mount of the component. This can lead to issues as React is wondering
        what is going on. Don't want to risk anything.
    */
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section {...propagated}>
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
                    <Tippy content={`${copied ? 'Copied' : 'Copy'} ${codeMode.toUpperCase()} to Clipboard${copied ? '!' : ''}`} theme="primary" onHidden={(e) => setCopied(false)} hideOnClick={false}>
                        <button onClick={handleCopy}>
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
                {
                    codeMode === 'css' ? (
                        css.map(({ line, explanation }) => (
                            line && explanation ? (
                                <InteractiveCSSLine line={line} explanation={explanation} />
                            ) : <CSSLine line={line} />
                        ))
                    ) : <div><code className="language-html">{html}</code></div>
                }
                </pre>
            </div>
        </section>        
    )
}