<script setup lang="ts">
</script>

<template>
  <div class="app-page" style="padding: 24px;">
    <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 20px;">作物图鉴</h1>
    <p style="color: var(--app-text-muted);">全作物图鉴，浏览和查阅所有植物信息。</p>

    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 12"
        :key="i"
        class="border rounded-lg p-4 bg-white"
        style="background: var(--app-surface);"
      >
        <div style="width: 48px; height: 48px; border-radius: 8px; background: var(--app-surface-muted); display: grid; place-items: center; font-size: 24px; margin-bottom: 12px;">
          🌱
        </div>
        <h3 style="margin: 0 0 4px; font-size: 15px; font-weight: 700;">作物 {{ i }}</h3>
        <p style="margin: 0; font-size: 13px; color: var(--app-text-muted);">图鉴数据加载中…</p>
      </div>
    </div>
  </div>
</template>
