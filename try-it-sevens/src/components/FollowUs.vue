<script setup>
// You can pass in an array of { href, icon } if you want dynamic variation
</script>

<template>
    <h2>Follow us</h2>
    <div class="flex justify-center space-x-4 mt-6">
        <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
        <!-- Replace with your SVG icon -->
        <svg class="w-6 h-6 fill-current text-gray-700 hover:text-blue-600 transition" viewBox="0 0 24 24">
            <!-- Facebook SVG Path -->
            <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12"/>
        </svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
        <svg class="w-6 h-6 fill-current text-gray-700 hover:text-pink-500 transition" viewBox="0 0 24 24">
            <!-- Instagram SVG Path -->
            <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zM12 7a5 5 0 110 10 5 5 0 010-10zm6.5-.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            <circle cx="12" cy="12" r="3.2"/>
        </svg>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter">
        <svg class="w-6 h-6 fill-current text-gray-700 hover:text-blue-400 transition" viewBox="0 0 24 24">
            <!-- Twitter SVG Path -->
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.6 8.6 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.12 12.12 0 013 4.8a4.28 4.28 0 001.33 5.7 4.27 4.27 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.95A8.6 8.6 0 012 19.54a12.1 12.1 0 006.56 1.92c7.88 0 12.2-6.54 12.2-12.2l-.01-.56A8.72 8.72 0 0024 5.5a8.4 8.4 0 01-2.54.7z"/>
        </svg>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok">
        <svg class="w-6 h-6 fill-current text-gray-700 hover:text-black transition" viewBox="0 0 24 24">
            <!-- TikTok SVG Path -->
            <path d="M9 3h3v12a3 3 0 01-3-3H6a6 6 0 006 6 6 6 0 006-6V6h-3v1.86A3 3 0 0112 11a3 3 0 01-3-3V3z"/>
        </svg>
        </a>
    </div>
</template>

<style scoped>
/* adjust hover states or sizes here if needed */
</style>
