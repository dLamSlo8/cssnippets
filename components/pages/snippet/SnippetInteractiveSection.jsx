import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';

import QuestionIcon from '@media/question-icon.svg';
import ClipboardIcon from '@media/clipboard-icon.svg';
import ExpandIcon from '@media/expand-icon.svg';

export default function SnippetInteractiveSection() {
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
    */
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <section>
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
                    <Tippy content="Copy to Clipboard" theme="primary">
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
                <pre className="snippet-l-code">
                    <code className="language-css">
                    {
                        `
                        .test {
                            position: relative;
                        }
                        .test-2 {
                            position: absolute;
                        }
                        `
                    }
                    </code>
                </pre>
            </div>
        </section>        
    )
}