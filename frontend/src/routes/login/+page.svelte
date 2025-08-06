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

            // Di aplikasi nyata, simpan token/user info di localStorage atau Svelte store
            message = `Login berhasil! Selamat datang, ${data.user.username}.`;
            // Redirect ke halaman dashboard atau halaman utama setelah login
            // goto('/dashboard');

        } catch (err) { // Mengganti nama variabel ke 'err' adalah praktik umum
            if (err instanceof Error) {
                // Jika 'err' adalah objek Error, kita bisa akses .message dengan aman
                message = err.message;
            } else {
                // Fallback jika yang di-throw bukan objek Error
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