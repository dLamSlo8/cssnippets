import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import ChevronDownIcon from '@media/chevron-down-icon.svg';
import ChevronUpIcon from '@media/chevron-up-icon.svg';
import InformationIcon from '@media/information-icon.svg';

// TODO Add accessibility to button (look at Reach UI accordion docs for proper usage: https://reach.tech/accordion)
export default function InteractiveCodeLine({ language, line, explanation }) {
    const [showExplanation, setShowExplanation] = useState(false);

    return (
        <>
            <button className="snippet-c-code-line snippet-c-code-line--button" onClick={() => setShowExplanation((showExplanation) => !showExplanation)}>
                <div className="l-stack-inline-5 u-align-center">
                    <code className={`language-${language}`}>
                        {line}
                    </code>
                    <InformationIcon className="snippet-c-code-line-icon snippet-c-code-line-icon--persistent u-flex-none" width="18" height="18" />
                    {
                        showExplanation ? (
                            <ChevronUpIcon className="snippet-c-code-line-icon u-flex-none" width="18" height="18" />
                        ) : (
                            <ChevronDownIcon className="snippet-c-code-line-icon u-flex-none" width="18" height="18" />
                        )
                    }
                </div>
            </button>
            
            <CSSTransition
            in={showExplanation}
            classNames="snippet-explanation"
            timeout={showExplanation ? 200 : 0}
            unmountOnExit>
                <div className="snippet-c-code-explanation" dangerouslySetInnerHTML={{__html: explanation }}></div>
            </CSSTransition>
        </>
    );
}