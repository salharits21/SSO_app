<script>
  import { goto } from '$app/navigation';

  let username = '';
  let email = '';
  let password = '';
  let message = '';
  let isLoading = false;

  async function handleRegister() {
    isLoading = true;
    message = '';
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mendaftar.');
      }

      message = 'Registrasi berhasil! Anda akan dialihkan ke halaman login...';
      setTimeout(() => {
        goto('/login');
      }, 2000);

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
  <h1>Daftar Akun Baru</h1>
  <form on:submit|preventDefault={handleRegister}>
    <div>
      <label for="username">Username</label>
      <input type="text" id="username" bind:value={username} required />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required />
    </div>
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Mendaftar...' : 'Daftar'}
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