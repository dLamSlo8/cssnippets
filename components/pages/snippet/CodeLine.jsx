// TODO Add accessibility to button (look at Reach UI accordion docs for proper usage: https://reach.tech/accordion)
export default function CodeLine({ language, line }) {
    return (
        <div className="snippet-c-code-line">
            <code className={`language-${language}`}>
                {line}
            </code>
        </div>
    );
}