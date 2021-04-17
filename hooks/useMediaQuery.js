import { useState, useEffect } from 'react';

export default function useMediaQuery(query) {
    const [matches, setMatches] = useState(null);

    /* 
        Effect:
        After mount, check media query.
    */
    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        mediaQuery.addEventListener('change', handleQueryChange);

        setMatches(mediaQuery.matches);

        function handleQueryChange(e) {
            console.log(e.matches);
            setMatches(e.matches);
        }

        return () => {
            mediaQuery.removeEventListener('change', handleQueryChange);
        }
    }, []);

    return matches;
}