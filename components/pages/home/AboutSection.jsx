import { useState } from 'react';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';

import CloseIcon from '@media/close-icon.svg';

import Button from '@components/Button';

// TODO find proper name for this file. 
export default function AboutSection() {
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    return (
        <section className="u-relative">
            <p className="u-font-xl u-font-medium">
                A collection of HTML + CSS snippets for cool UI, and attempted explanations of how they're created.
            </p>
            <Button rootClass="c-button--size-medium u-font-bold u-mt-8" onClick={() => setIsAboutOpen(true)} >About / Motivation</Button>
            <CSSTransition
            in={isAboutOpen}
            classNames="fade-scale"
            timeout={200}
            unmountOnExit>
                <section className="home-c-about">
                    <header className="home-l-about__header home-c-about__header">
                        <h2 className="u-font-bold -u-mt-2">About / Motivation</h2>
                        <button onClick={() => setIsAboutOpen(false)} className="home-l-about__close">
                            <CloseIcon width="30" height="30" />
                        </button>
                    </header>
                    <div className="home-c-about__content">
                        <p>
                            Have you ever gone to a site, noticed cool-looking UI, and dived into DevTools to see the markup 
                            and styling used to create it, or tried recreating it for practice/fun?
                        </p>
                        <p>
                            I’m Derek, the developer of this site, and I’ve found myself in that situation a lot, but I never 
                            really organized my thoughts and learnings from those experiences.
                        </p>
                        <p>
                            This site is the result of now taking a more active approach to learning from inspiring UI, and my hope 
                            and goal is that at least one of these snippets is interesting to you, and that you learn something from it.
                        </p>
                        <p>
                            I will continue to expand on this catalog of snippets as I consume more UI day-to-day. I’ll also be keeping 
                            a <Link href="/"><a className="u-color-primary u-font-bold">changelog</a></Link> for anyone interested in the project’s growth. Thanks a ton for visiting the site!
                        </p>
                    </div>
                </section>   
            </CSSTransition>
        </section>
    )
}