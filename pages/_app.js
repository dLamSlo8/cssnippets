import { useEffect } from 'react';

import '../styles/main.scss';

function MyApp({ Component, pageProps }) {

    useEffect(() => {
        (async () => {
            await import('style-scoped');
        })();
    }, []);

    return <Component {...pageProps} />
}

export default MyApp
