import { useState, createContext, useEffect } from 'react';

/* 
    This context propagates information about user settings, specifically 
    prefers-reduced-motion and dark mode. I might just create a custom hook instead
    of context. I don't know if it's necessary to propagate, because it might only affect
    navbar, where the manual user settings will be.

    However, it's not like this updates frequently anyway, but just something to think about!
    // TODO Consider switching user settings to hook-only, as it doesn't affect much of the UI (for now).

    Was thinking about high-contrast mode, but that seems to be not supported much, 
    but will keep this link here for reference when it becomes more common:
    https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_Media_Queries_for_Accessibility
*/
const UserSettingsContext = createContext();

export const UserSettingsContextProvider = ({ children }) => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    /* 
        Effect:
        Check all user settings + attach query change handlers after mount. 
        Needs to happen in browser, not during Next SSR.
    */
    useEffect(() => {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        reducedMotionQuery.addEventListener('change', (e) => {
            handleReducedMotion(e.matches);
        });

        darkModeQuery.addEventListener('change', (e) => {
            handleDarkMode(e.matches);
        });

        // TODO Determine whether to use variable or attribute. Current solution is to turn off transitions w/ data attribute, and only turn on when super important (!important)
        /**
         * Applies the appropriate CSS variable when motion is reduced
         * @param {boolean} matches Whether or not we reduced motion
         */
        function handleReducedMotion(matches) {
            if (matches) {
                // document.documentElement.style.setProperty('--reduce-motion-speed', '0ms');
                document.documentElement.setAttribute('data-reduce-motion', '');
            }
            else {
                // document.documentElement.style.removeProperty('--reduce-motion-speed');
                document.documentElement.removeAttribute('data-reduce-motion');
            }

            setPrefersReducedMotion(matches);
        }

        /**
         * Applies the appropriate data attribute when in dark mode
         * @param {boolean} matches Whether or not we are in dark mode 
         */
        function handleDarkMode(matches) {
            if (matches) {
                document.documentElement.setAttribute('data-color-scheme', 'dark');
            }
            else {
                document.documentElement.setAttribute('data-color-scheme', 'light');
            }

            setDarkMode(darkModeQuery.matches);
        }

        handleReducedMotion(reducedMotionQuery.matches);
        handleDarkMode(darkModeQuery.matches);
    }, []);

    return (
        <UserSettingsContext.Provider value={{
            prefersReducedMotion,
            darkMode
        }}>
            {children}
        </UserSettingsContext.Provider>
    )
}

