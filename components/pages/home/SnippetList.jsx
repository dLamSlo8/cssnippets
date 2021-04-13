export default function SnippetList({ snippets }) {
    console.log(snippets);

    return (
        <ul>
        {
            snippets.map(({ name, html, css }) => (
                <li key={name} dangerouslySetInnerHTML={{__html: `
                    <div>
                        <style scoped>
                            ${css}
                        </style>
                        ${html}
                    </div>
                ` }}>
                </li>
            ))
        }
        </ul>
    )
}