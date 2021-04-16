export default function SnippetVisual({ html, css }) {
    return (
        <>
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
        </>
    )
}