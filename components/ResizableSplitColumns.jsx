import React from 'react';

export default function ResizableSplitColumns({ children }) {
    const childrenArray = React.Children.toArray(children);
    
    return (
        <>
            {childrenArray[0]}
            <div>Hi I'm a divider!!</div>
            {childrenArray[1]}
        </>
    )
}