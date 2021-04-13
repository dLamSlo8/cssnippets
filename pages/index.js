import Head from 'next/head'

import getSnippets from '../lib/snippets';

import EyeIcon from '@media/eye-icon.svg';
import PencilIcon from '@media/pencil-icon.svg';
import ClipboardIcon from '@media/clipboard-icon.svg';

import SnippetSearch from '@components/pages/home/SnippetSearch';
import SnippetList from '@components/pages/home/SnippetList';

export default function Home({ snippets }) {
    return (
        <div className="l-container l-main">
            <header className="home-c-header">
                <h1>CSSnippets</h1>
                <div className="home-l-header-content">
                    <section className="u-font-md">
                        <p>
                            Hi! I’m Derek, a frontend developer who finds a lot of inspiration from visiting sites. 
                            This website is a catalog of cool HTML + CSS snippets that I find online and my attempted 
                            explanations as to why they work. 
                        </p>
                        <p className="u-mt-3">
                            This site will receive a steady stream of updates every week, and I’ll be keeping a changelog
                            for anyone interested in the project’s growth! Thanks a ton for visiting my site!
                        </p>
                    </section>
                    <section className="home-c-features">
                        <header className="home-l-features__header">
                            <h2>Features</h2>
                            <span className="home-c-features__decorative-line"></span>
                        </header>
                        <article className="home-l-feature">
                            <EyeIcon width="24" height="24" className="u-flex-none" />
                            <div>
                                <h3>View Snippets</h3>
                                <p className="u-mt-3">View both the snippet and
                                its HTML, CSS, and occasionally
                                JS.</p>
                            </div>
                        </article>
                        <article className="home-l-feature">
                            <PencilIcon width="24" height="24" className="u-flex-none" />
                            <div>
                                <h3>Interactive Playground</h3>
                                <p className="u-mt-3">
                                    Edit the snippet to your liking, whether
                                    it be used specifically in your own project,
                                    or whether you just want to experiment with
                                    different values!
                                </p>
                            </div>
                        </article>
                        <article className="home-l-feature">
                            <ClipboardIcon width="24" height="24" className="u-flex-none" />
                            <div>
                                <h3>Copy + Paste</h3>
                                <p className="u-mt-3">
                                    When you’re ready and feel like
                                    you understand how it works, use
                                    the snippet in your own projects!
                                </p>
                            </div>
                        </article>
                    </section>
                </div>
            </header>
            <main className="home-l-main">
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