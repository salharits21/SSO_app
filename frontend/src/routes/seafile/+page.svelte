<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(() => {
        // Cek jika user sudah login di client-side
        const user = localStorage.getItem('user');
        if (!user) {
            // Jika belum, lempar ke halaman login
            goto('/login');
        }
    });
</script>

<svelte:head>
    <title>My Seafile</title>
</svelte:head>

<div class="seafile-container">
    <iframe
        src="/seafile/"
        frameborder="0"
        width="100%"
        height="800px"
        title="Seafile"
    ></iframe>
</div>

<style>
    .seafile-container {
        margin-top: 1rem;
        border: 1px solid #ccc;
    }
</style>