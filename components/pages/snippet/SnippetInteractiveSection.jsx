import { useState, useEffect } from 'react';
import Prism from 'prismjs';

import QuestionIcon from '@media/question-icon.svg';
import ClipboardIcon from '@media/clipboard-icon.svg';
import ExpandIcon from '@media/expand-icon.svg';

export default function SnippetInteractiveSection() {
    const [viewMode, setViewMode] = useState('explanation');

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <section>
            {/* Top bar */}
            <header className="l-stack-inline-6">
                <button>HTML</button>
                <button>CSS</button>
                {/* View Mode Component */}
                
                {/* Icons */}
                <div className="l-stack-inline-3">
                    <QuestionIcon width="24" height="24" />
                    <ClipboardIcon width="24" height="24" />
                    <ExpandIcon width="24" height="24" />
                </div>
            </header>
            {/* Main content (where code should go) */}
            <div>
                <pre>
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