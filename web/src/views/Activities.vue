<script setup lang="ts">
</script>

<template>
  <div class="app-page" style="padding: 24px;">
    <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 20px;">活动中心</h1>
    <p style="color: var(--app-text-muted);">游戏内活动信息集中查看。</p>

    <div class="mt-4 grid gap-4">
      <el-card v-for="i in 3" :key="i" shadow="never">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 56px; height: 56px; border-radius: 8px; background: var(--app-accent-muted); display: grid; place-items: center; font-size: 28px; flex-shrink: 0;">
            🎯
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: 700;">活动 {{ i }}</h3>
            <p style="margin: 0; font-size: 13px; color: var(--app-text-muted);">活动详情内容加载中…</p>
          </div>
          <el-tag round effect="plain" type="info">进行中</el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>
