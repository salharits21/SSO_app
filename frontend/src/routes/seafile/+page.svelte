<script>
  // --- BAGIAN KONFIGURASI ---
  // Ganti URL ini dengan URL Seafile Anda yang sebenarnya.
  // Pastikan URL ini benar dan bisa diakses.
  const seafileUrl = 'https://seafile.com'; 

  // Variabel untuk mengelola status loading iframe
  let isLoading = true;

  function handleIframeLoad() {
    // Fungsi ini akan dipanggil saat konten iframe selesai dimuat
    // Kita set isLoading menjadi false untuk menyembunyikan spinner
    isLoading = false;
  }
</script>

<div class="page-container">
  <h1>Portal Seafile</h1>
  <p>Berikut adalah antarmuka Seafile.</p>

  <div class="iframe-wrapper">
    {#if isLoading}
      <div class="loading-overlay">
        <div class="spinner"></div>
        <p>Memuat Seafile...</p>
      </div>
    {/if}

    <iframe
      src={seafileUrl}
      on:load={handleIframeLoad}
      title="Antarmuka Seafile"
      frameborder="0"
    ></iframe>
  </div>
</div>

<style>
  .page-container {
    padding: 1rem 2rem;
    font-family: sans-serif;
  }

  .iframe-wrapper {
    /* Position relative agar kita bisa memposisikan loading overlay di tengah */
    position: relative;
    width: 100%;
    /* Atur tinggi iframe sesuai kebutuhan, 80vh berarti 80% dari tinggi layar */
    height: 80vh; 
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden; /* Menyembunyikan sudut iframe yang mungkin tidak bulat */
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none; /* Pastikan tidak ada border */
  }

  /* Styling untuk loading overlay dan spinner */
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-overlay p {
    margin-top: 1rem;
    font-size: 1.1rem;
    color: #333;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>