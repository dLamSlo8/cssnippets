import { useEffect } from 'react';

import { UserSettingsContextProvider } from '@contexts/UserSettingsContext';

import '../styles/main.scss';
import 'tippy.js/dist/tippy.css'; // Tippy styles

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

    return (
        <UserSettingsContextProvider>
            <Component {...pageProps} />
        </UserSettingsContextProvider>
    )
}

export default MyApp
