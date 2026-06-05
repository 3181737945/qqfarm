<script setup lang="ts">
</script>

<template>
  <div class="app-page" style="padding: 24px;">
    <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 20px;">数据统计</h1>
    <p style="color: var(--app-text-muted);">账号运行数据与收益统计。</p>

    <div class="mt-4 grid gap-4 md:grid-cols-3">
      <el-card v-for="i in 3" :key="i" shadow="never">
        <div style="font-size: 12px; color: var(--app-text-muted); margin-bottom: 4px;">
          {{ ['今日收益', '本周收益', '本月收益'][i-1] }}
        </div>
        <div style="font-size: 28px; font-weight: 800; color: var(--app-accent);">
          --
        </div>
      </el-card>
    </div>

    <el-card class="mt-4" shadow="never">
      <template #header>
        <span style="font-weight: 700;">详细数据</span>
      </template>
      <div style="display: grid; place-items: center; min-height: 200px; color: var(--app-text-muted); font-size: 14px;">
        统计数据加载中，请先选择一个运行中的账号
      </div>
    </el-card>
  </div>
</template>
