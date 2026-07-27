<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-base p-24 text-center">
    <pre class="text-primary text-xs leading-tight">{{ mascot }}</pre>
    <h1 class="text-4xl font-bold text-slate-100">Welcome to your hackpack project</h1>
    <p class="max-w-md text-slate-400">
      Edit <code class="rounded bg-surface-muted px-1.5 py-0.5 text-sm">app.vue</code> to get started.
    </p>
    <a
      href="https://hackpack.dev/docs"
      class="rounded-sm bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-dark"
    >
      View Docs
    </a>
  </div>
</template>

<script setup>
const mascot = "   /\\_/\\\n  ( ^.^ )\n =( 🎒 )=";
</script>
