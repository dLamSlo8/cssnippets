import { useRouter } from 'next/router';

import SnippetInteractiveSection from '@components/pages/snippet/SnippetInteractiveSection';

export default function SnippetPage() {
    const router = useRouter();
    const { snippet } = router.query;
    
    return (
        <main>
            <h1>{snippet}</h1>
            <SnippetInteractiveSection />
        </main>

    )
}