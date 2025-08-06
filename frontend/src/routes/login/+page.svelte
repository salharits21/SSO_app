<script>
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let message = '';
    let isLoading = false;

    async function handleLogin() {
        isLoading = true;
        message = '';
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal login.');
            }

            // Simpan data pengguna ke localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            // Arahkan ke halaman utama setelah login berhasil
            goto('/home');
        } catch (err) {
            if (err instanceof Error) {
                message = err.message;
            } else {
                message = 'Terjadi kesalahan yang tidak diketahui.';
            }
        } finally {
            isLoading = false;
        }
    }
</script>

<main>
    <h1>Login</h1>
    <form on:submit|preventDefault={handleLogin}>
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" bind:value={email} required />
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" id="password" bind:value={password} required />
        </div>
        <button type="submit" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Login'}
        </button>
    </form>

    {#if message}
        <p class="message">{message}</p>
    {/if}
</main>

<style>
    main { max-width: 400px; margin: auto; padding: 1rem; }
    form div { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.25rem; }
    input { width: 100%; padding: 0.5rem; }
    .message { margin-top: 1rem; text-align: center; }
</style>