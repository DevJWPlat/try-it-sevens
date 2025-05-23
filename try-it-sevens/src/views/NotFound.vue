<script setup>
    import { RouterLink } from 'vue-router'
</script>

<template>
    <main>
        <div class="wrapper">
            <h1>Error 404</h1>
            <p>You've run into touch!</p>
            <p>
            The page you're looking for has been tackled out of play.<br>
            </p>
            <p>
            Try heading back to the main pitch.
            </p>
            <RouterLink
            to="/"
            class="custom-button"
            >
            Return Home
        </RouterLink>
        </div>
    </main>
</template>

<style lang="scss" scoped>
    main {
        text-align: center;
        h1 {
            font-size: 40px;
            font-weight: 700;
            margin-bottom: 50px;
        }
        p {
            width: 80%;
            margin: 0 auto 10px auto;
            font-weight: 500;
            font-size: 18px;        
        }
        .custom-button {
            margin-top: 50px;
            background: #231F20;
            padding: 12px 30px;
            color: #96D1F2;
            font-weight: 400;
            letter-spacing: 1px;
            border-radius: 12px;
            width: max-content;
            display: block;
            text-align: center;
            width: 100%;
            transition: all .3s;
        }
        
        .custom-button:hover {
          background: #96D1F2;
          color: #231F20;
        }
    }
</style>  