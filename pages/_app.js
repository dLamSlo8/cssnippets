import { useEffect } from 'react';

import '../styles/main.scss';

function MyApp({ Component, pageProps }) {

    // TODO I do want to try to include the polyfill during build so browser doesn't require JS.
    // Currently, without JS, the scoped style won't work and any styles included will be global instead.
    /* 
        Effect:
        Dynamically import scoped style polyfill 
        after initial render b/c it requires document,
        which is inaccessible when SSR until after rehydration
    */
    useEffect(() => {
        (async () => {
            await Promise.all([
                import('style-scoped'),
                import('focus-visible')
            ]);
        })();
    }, []);

    return <Component {...pageProps} />
}

export default MyApp
