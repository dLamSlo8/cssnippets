import Head from 'next/head'

import getSnippets from '../lib/snippets';

import EyeIcon from '@media/eye-icon.svg';
import PencilIcon from '@media/pencil-icon.svg';
import ClipboardIcon from '@media/clipboard-icon.svg';

import AboutSection from '@components/pages/home/AboutSection';
import SnippetSearch from '@components/pages/home/SnippetSearch';
import SnippetList from '@components/pages/home/SnippetList';

// TODO Add about/motivation button + content (overlay over current text and button with white background + box-shadow and close button)
// TODO Rename settings.json to metadata.json. Think it makes more sense
export default function Home({ snippets }) {
    return (
        <div className="l-container l-stack-block-8">
            <header className="l-stack-block-8">
                <h1>CS<span className="c-text-skewed-underline">Snippets</span></h1>
                <div className="home-l-header-content">
                    <AboutSection />
                    <section className="l-stack-block-4">
                        <header className="l-stack-inline-8">
                            <h2>Features</h2>
                            <span className="home-c-features-decorative-line"></span>
                        </header>
                        <article className="l-stack-inline-4">
                            <EyeIcon width="24" height="24" className="u-flex-none" />
                            <div className="l-stack-block-3">
                                <h3>View Snippets</h3>
                                <p>View both the snippet and
                                its HTML, CSS, and occasionally
                                JS.</p>
                            </div>
                        </article>
                        <article className="l-stack-inline-4">
                            <PencilIcon width="24" height="24" className="u-flex-none" />
                            <div className="l-stack-block-3">
                                <h3>Interactive Playground</h3>
                                <p>
                                    Edit the snippet to your liking, whether
                                    it be used specifically in your own project,
                                    or whether you just want to experiment with
                                    different values!
                                </p>
                            </div>
                        </article>
                        <article className="l-stack-inline-4">
                            <ClipboardIcon width="24" height="24" className="u-flex-none" />
                            <div className="l-stack-block-3">
                                <h3>Copy + Paste</h3>
                                <p>
                                    When you’re ready and feel like
                                    you understand how it works, use
                                    the snippet in your own projects!
                                </p>
                            </div>
                        </article>
                    </section>
                </div>
            </header>
            <main className="l-stack-block-8">
                <h2 className="u-font-xl">Snippets</h2>
                <SnippetSearch />
                <SnippetList snippets={snippets} />
            </main>
        </div>
    
    )
}

export async function getStaticProps() {
    return {
        props: {
            snippets: getSnippets()
        }
    };
}