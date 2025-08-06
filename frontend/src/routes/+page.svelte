<script>
  import { onMount } from 'svelte';

  let greetingMessage = 'Memuat data...';

  // onMount berjalan setelah komponen di-render di browser
  onMount(async () => {
    try {
      // Panggil API backend kita di Express
      const response = await fetch('http://localhost:3000/api/health');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      greetingMessage = data.message; // Ambil pesan dari respons JSON
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      greetingMessage = 'Gagal memuat data dari server.';
    }
  });
</script>

<main>
    <h1>Selamat Datang di SvelteKit + Express</h1>
    <p>
    Pesan dari server backend: <strong>{greetingMessage}</strong>
    </p>
    <nav>
    <a href="/login">Login</a>
    <a href="/register">Daftar</a>
    </nav>
</main>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
    padding-top: 2rem;
  }
  nav {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }
</style>