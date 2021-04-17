import React, { useEffect, useRef, useState } from 'react';

export default function ResizableSplitColumns({ children, fullWidth, leftMinWidth }) {
    const childrenArray = React.Children.toArray(children);
    const dividerRef = useRef(null);
    const firstChildRef = useRef(null);
    const [width, setWidth] = useState(fullWidth / 2);
    const firstChildBoundingClientRectRef = useRef(null);


    /* 
        Effect:
        On mount, attach a resize handler to recalculate the boundingClientRect for the first child.
        This is so that we don't have to recalculate the boundingClientRect every time
        we move the divider (we use the value to deetermine how wide the first child should be!)
    */
    useEffect(() => {
        // On mount, get the initial client rect!
        firstChildBoundingClientRectRef.current = firstChildRef.current.getBoundingClientRect();

        window.addEventListener('resize', handleResize);

        function handleResize(e) {
            firstChildBoundingClientRectRef.current = firstChildRef.current.getBoundingClientRect();

        }

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        dividerRef.current.addEventListener('mousedown', handleMouseDown);


        function handleMouseDown(e) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            document.body.style.cursor = 'col-resize';
        }

        function handleMouseMove(e) {
            setWidth(e.x - firstChildBoundingClientRectRef.current.x);
        }

        function handleMouseUp(e) {
            window.removeEventListener('mousemove', handleMouseMove);
            
            document.body.style.cursor = '';
        };

        return () => {
            dividerRef.current?.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mosuemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

    }, []);




    return (
        <>
        {
            React.cloneElement(childrenArray[0], {
                ref: firstChildRef,
                style: {
                    width: `calc(${width}px - var(--resizable-columns-gap))`,
                    minWidth: leftMinWidth
                }
            })
        }
            <div ref={dividerRef} className="snippet-c-divider"></div>
            {childrenArray[1]}
        </>
    )
}