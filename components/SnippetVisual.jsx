import React from 'react';

/*
    Represents the snippet itself. Uses a forwardRef implementation
    in case an outer component needs to access its DOM node.
*/
const SnippetVisual = React.forwardRef(({ html, css, ...propagated }, ref) => { 

    return (
    <>
        {/* 
            We specifically set transform to translate(0) (or really any value other than none) 
            to handle the case where we have a fixed element. This is because when we have a transform
            set to a non-none value, the element becomes the containing block for the fixed element!
        */}
        <div ref={ref} {...propagated} style={{transform: "translate(0)", ...propagated.style }} dangerouslySetInnerHTML={{__html: `
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
)});

export default SnippetVisual;