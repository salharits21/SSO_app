<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let username = '';

    onMount(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                username = user.username;
            } catch (e) {
                // Hapus data yang rusak dan arahkan ke login
                localStorage.removeItem('user');
                goto('/login');
            }
        } else {
            // Jika tidak ada data pengguna, arahkan ke login
            goto('/login');
        }
    });

    function handleLogout() {
        localStorage.removeItem('user');
        goto('/login');
    }

    function goToSeafile() {
        // Tentukan URL Seafile Anda di sini
        goto('/seafile');
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 class="text-4xl font-bold mb-4 text-gray-800">Selamat datang, {username}!</h1>
        <p class="text-gray-600 mb-6">Anda telah berhasil login.</p>
        <div class="flex flex-col space-y-4">
            <button
                on:click={goToSeafile}
                class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
                Seafile
            </button>
            <button
                on:click={handleLogout}
                class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    </div>
</div>