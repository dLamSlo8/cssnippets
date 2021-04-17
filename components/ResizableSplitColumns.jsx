import React, { useEffect, useRef, useState, useCallback } from 'react';

// TODO Allow width to be recalculated based on its percentage of the full width, on resize. May be excessive, and may need to throttle.
// TODO Currently we have an issue where we can effectively increase / decrease the width to infinities (b/c width !== offsetWidth), then when we switch to tabbing
// and try to use arrow keys, we run into issue where the width is so far off that it takes so long to get the width where we want it to be.
// We need some way to cap at the min-width of the first child and somehow the max width, but we can't get that value b/c it's dynamic depending on the content
// of the second child. Will need to put more thought into this. 
// TODO Change of plans. We're going to specificy a right min width, and by doing so, we now have exact boundaries that we can work with to determine how far the divider can go in any direction!
/* 
    Possible solution:
    When we reach min width, set some ref to stuck left.
    Then, get the current client 
*/
export default function ResizableSplitColumns({ children, fullWidth, leftMinWidth, rightMinWidth }) {
    const childrenArray = React.Children.toArray(children);
    const dividerRef = useRef(null);
    const firstChildRef = useRef(null);
    const [width, setWidth] = useState(fullWidth / 2);
    const firstChildBoundingClientRectRef = useRef(null);
    // const prevWidthRef = useRef(null);
    // const prevXRef = useRef(null);
    // const directionRef = useRef(null);
    // const stopSettingWidthRef = useRef(false);

    const handleDividerKeydown = useCallback((e) => {
        if (e.key === 'ArrowRight') {
            setWidth((width) => width + 10);
        }
        else if (e.key === 'ArrowLeft') {
            setWidth((width) => width - 10);
        }
    }, []);

    const handleDividerFocus = () => {
        console.log('focused');
        window.addEventListener('keydown', handleDividerKeydown);
    };

    const handleDividerBlur = () => {
        console.log('blurred');
        window.removeEventListener('keydown', handleDividerKeydown);
    };

    useEffect(() => {
        
    }, [width]);

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
            console.log('resizing');
            // Conditional is used b/c firstChildRef disappears when we unmount this component due to mobile screen.
            // This is to catch any stray event handlers b/c of the speedy nature of resize handler!
            if (firstChildRef.current) {
                firstChildBoundingClientRectRef.current = firstChildRef.current.getBoundingClientRect();
            }

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

            document.body.style.cursor = 'col-resize'; // Avoids flicker of col-resize cursor and pointer cursor
        }

        function handleMouseMove(e) {
            console.log(e);
                const newWidth = e.x - firstChildBoundingClientRectRef.current.x;

                // if (firstChildRef.current.offsetWidth !== prevWidthRef.current) {
                    setWidth(newWidth);
                // }
    
                // prevWidthRef.current = newWidth;



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

    /* 
        Effect:
        On mount, attach event handlers to check whether we're focusing with tab or mouse.
        This assumes we start with mouse, then relies on tab to switch the focus mechanism.
        I think this works best b/c we give keyboard-only the first option, as person
        with mouse already has the optimal experience.
    */
    // useEffect(() => {
    //     window.addEventListener('keydown', handleKeyDown);

    //     function handleKeyDown(e) {
    //         if (e.key === 'Tab') {
    //             console.log('tabbed!');
    //             focusMechanismRef.current = 'tab';
                
    //             window.addEventListener('mousedown', handleMouseDown);
    //             window.removeEventListener('keydown', handleKeyDown);
    //         }
    //     };

    //     function handleMouseDown(e) {
    //         console.log('clicked!');
    //         focusMechanismRef.current = 'mouse';

    //         window.addEventListener('keydown', handleKeyDown);
    //         window.removeEventListener('mousedown', handleMouseDown);
    //     }

    //     return () => {
    //         window.removeEventListener('mousedown', handleMouseDown);
    //         window.removeEventListener('keydown', handleKeyDown);
    //     }
    // }, []);

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
            <div 
            ref={dividerRef} 
            className="snippet-c-divider" 
            tabIndex="0"
            onFocus={handleDividerFocus}
            onBlur={handleDividerBlur}></div>
            {childrenArray[1]}
        </>
    )
}