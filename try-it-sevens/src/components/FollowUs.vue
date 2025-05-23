<script setup>
import facebook from '@/assets/images/socials/f.png'
import insta from '@/assets/images/socials/i.png'
import youtube from '@/assets/images/socials/y.png'
import x from '@/assets/images/socials/x.png'
import tiktok from '@/assets/images/socials/t.png'
</script>

<template>
    <div class="wrapper">
        <h2 class="main-sub-heading mb-4">Follow us</h2>
        <div class="flex icons-wrapped">
            <a href="https://www.youtube.com/@tryitrugby" target="_blank" rel="noopener" aria-label="Youtube" class="a-icon">
                <img :src="youtube" alt="youtube" class="social-icon" />
            </a>
            <a href="https://www.facebook.com/TryItRugbyAcademy/" target="_blank" rel="noopener" aria-label="Facebook" class="a-icon">
                <img :src="facebook" alt="facebook" class="social-icon" />
            </a>
            <a href="https://www.instagram.com/tryit_rugby/" target="_blank" rel="noopener" aria-label="Instagram" class="a-icon">
                <img :src="insta" alt="instagram" class="social-icon" />
            </a>
            <a href="https://x.com/RugbyTryit" target="_blank" rel="noopener" aria-label="X" class="a-icon">
                <img :src="x" alt="x" class="social-icon" />
            </a>
            <a href="https://www.tiktok.com/@tryit_rugby" target="_blank" rel="noopener" aria-label="TikTok" class="a-icon">
                <img :src="tiktok" alt="tiktok" class="social-icon" />
            </a>
        </div>
    </div>
</template>

<style scoped>
/* adjust hover states or sizes here if needed */
.wrapper {
    margin-top: 60px;
}
.icons-wrapped {
    width: 100%;
    gap: 20px;
}

.a-icon {
    width: 20%;
}
.social-icon {
    width: 100%;
}

</style>
