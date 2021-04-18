// TODO Add accessibility to button (look at Reach UI accordion docs for proper usage: https://reach.tech/accordion)
export default function CSSLine({ line }) {
    return (
        <div className="snippet-c-code-line">
            <code className="language-css">
                {line}
            </code>
        </div>
    );
}