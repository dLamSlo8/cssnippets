import { useRouter } from 'next/router';

export default function SnippetPage() {
    const router = useRouter();
    const { snippet } = router.query;
    
    return (
        <h1>{snippet}</h1>
    )
}