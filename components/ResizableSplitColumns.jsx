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
// TODO Change implementation of width. Now left and right will have specific widths. Maybe we'll do percentages. I think that's the way. CONVERT TO PERCENTAGE AFTER GETTING WIDTH SO IT SCALES WHEN SCREEN SIZE CHANGES!
export default function ResizableSplitColumns({ children, fullWidth, dividerWidth, gapWidth, leftMinWidth, rightMinWidth }) {
    const childrenArray = React.Children.toArray(children);
    const dividerRef = useRef(null);
    const firstChildRef = useRef(null);
    const halfWidth = (fullWidth - dividerWidth - (gapWidth * 2)) / 2;
    const [width, setWidth] = useState(halfWidth / fullWidth * 100);
    const [rightWidth, setRightWidth] = useState(halfWidth / fullWidth * 100);
    const [dividerFocused, setDividerFocused] = useState(false);
    const firstChildBoundingClientRectRef = useRef(null);
    const mouseDownDividerPosRef = useRef(null); // Used in calculation for % widths on handleMouseMove

    /**
     * Handles left and right arrow keys when the divider is focused.
     * When the widths are about to hit a bound, it caps at the bound.
     */
    const handleDividerKeydown = useCallback((e) => {
        const minRightWidth = rightMinWidth / fullWidth * 100;
        const minLeftWidth = leftMinWidth / fullWidth * 100;

        if (e.key === 'ArrowRight') {
            if ((rightWidth - 2) < minRightWidth) { // Check for bound
                const widthIncrease = rightWidth - minRightWidth;

                setWidth((width) => width + widthIncrease);
                setRightWidth(minRightWidth);
            }
            else {
                setWidth((width) => width + 2);
                setRightWidth((rightWidth) => rightWidth - 2);
            }
        }
        else if (e.key === 'ArrowLeft') {
            if ((width - 2) < minLeftWidth) { // Check for bound
                const widthIncrease = width - minLeftWidth;

                setWidth(minLeftWidth);
                setRightWidth((rightWidth) => rightWidth + widthIncrease);
            }
            else {
                setWidth((width) => width - 2);
                setRightWidth((rightWidth) => rightWidth + 2);
            }
        }
    }, [fullWidth, width, rightWidth]);

    // const handleDividerFocus = () => {
    //     window.addEventListener('keydown', handleDividerKeydown);
    // };

    // const handleDividerBlur = () => {
    //     window.removeEventListener('keydown', handleDividerKeydown);
    // };

    /* 
        Effect:
        Handles the attachment of the keydown handler based on whether or not
        the divider is focused. Also ensures that the handler is always updated
        by including it in the dependency array.
    */
    useEffect(() => {
        if (dividerFocused) {
            window.addEventListener('keydown', handleDividerKeydown);
        }
        else {
            window.removeEventListener('keydown', handleDividerKeydown);
        }

        return () => { // Runs before each effect after the first one as 'cleanup'.
            window.removeEventListener('keydown', handleDividerKeydown);
        }
    }, [dividerFocused, handleDividerKeydown]);

    /* 
        Effect:
        On mount, attach a resize handler to recalculate the boundingClientRect for the first child.
        This is so that we don't have to recalculate the boundingClientRect every time
        we move the divider (we use the value to determine how wide the first child should be!)
    */
    useEffect(() => {
        // On mount, get the initial client rect!
        firstChildBoundingClientRectRef.current = firstChildRef.current.getBoundingClientRect();

        window.addEventListener('resize', handleResize);

        function handleResize(e) {
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

    /* 
        Effect:
        Handles the main logic for dragging the divider. Dragging is available once the divider
        receives the mousedown event. This effect re-runs when fullWidth changes because fullWidth
        (the width of the resize container) is used in the % width calculations for the columns,
        so it needs to stay up-to-date.
    */
    useEffect(() => {
        dividerRef.current.addEventListener('mousedown', handleMouseDown);

        /**
         * Handles when the divider receives mousedown event. This allows for dragging to occur.
         */
        function handleMouseDown(e) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            
            // This ref is important to help calculate the % widths in the mousemove handler.
            mouseDownDividerPosRef.current = e.x - dividerRef.current.getBoundingClientRect().x;

            document.body.style.cursor = 'col-resize'; // Avoids flicker of col-resize cursor and pointer cursor
        }

        /**
         * Handles when the user drags across the screen once it has the divider selected.
         * Ensures exact widths (that will act as percentage to account for responsiveness) through
         * calculating using existing widths.
         */
        function handleMouseMove(e) {
            const newWidth = e.x - mouseDownDividerPosRef.current - firstChildBoundingClientRectRef.current.x - gapWidth;
            const newRightWidth = fullWidth - newWidth - dividerWidth - (gapWidth * 2);

            setWidth(newWidth / fullWidth * 100);
            setRightWidth(newRightWidth / fullWidth * 100);
        }

        /**
         * Handles when mouse is released after dragging the divider.
         * Makes sure to check to see if our width has exceed bounds, and if so,
         * turns it back to normal.
         */
        function handleMouseUp(e) {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            // Handle exceed right width.
            if (e.x > (fullWidth - rightMinWidth + firstChildBoundingClientRectRef.current.x)) {
                setRightWidth(rightMinWidth / fullWidth * 100);
                setWidth((fullWidth - rightMinWidth - dividerWidth - gapWidth * 2) / fullWidth * 100);
            }
            else if (e.x < (firstChildBoundingClientRectRef.current.x + leftMinWidth)) { // Handle exceed left width.
                setWidth(leftMinWidth / fullWidth * 100);
                setRightWidth((fullWidth - (leftMinWidth + dividerWidth + gapWidth * 2)) / fullWidth * 100);
            }
            
            document.body.style.cursor = '';
        };

        return () => { // Remember to clean up the event listeners so they don't persist when the component unmounts!
            dividerRef.current?.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

    }, [fullWidth]);


    return (
        <>
        {
            React.cloneElement(childrenArray[0], {
                ref: firstChildRef,
                style: {
                    width: `${width}%`,
                    minWidth: leftMinWidth,
                }
            })
        }
            <div 
            ref={dividerRef} 
            className="snippet-c-divider" 
            style={{ width: dividerWidth, marginLeft: gapWidth}}
            tabIndex="0"
            onFocus={() => setDividerFocused(true)}
            onBlur={() => setDividerFocused(false)}></div>
        {
            React.cloneElement(childrenArray[1], {
                style: {
                    marginLeft: gapWidth,
                    width: `${rightWidth}%`,
                    minWidth: rightMinWidth,
                }
            })
        }
        </>
    )
}