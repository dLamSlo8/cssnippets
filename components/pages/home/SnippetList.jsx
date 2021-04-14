import SnippetCard from './SnippetCard';

export default function SnippetList({ snippets }) {
    return (
        <ul className="home-l-snippet-list">
        {
            snippets.map((snippet) => (
                <li key={snippet.name}>
                    <SnippetCard snippet={snippet} />
                </li>
            ))
        }
        </ul>
    )
}