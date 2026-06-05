<script setup lang="ts">
import type { AccentTheme } from '@/stores/app'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

function selectTheme(accent: AccentTheme) {
  appStore.setAccentTheme(accent)
  appStore.toggleThemePanel()
}
</script>

<template>
  <div class="relative">
    <button
      class="icon-btn mx-2 !outline-none"
      title="主题设置"
      @click="appStore.toggleThemePanel()"
    >
      <div i-carbon-color-palette />
    </button>

    <teleport to="body">
      <div
        v-if="appStore.showThemePanel"
        class="fixed inset-0 z-[99] bg-black/30"
        @click="appStore.toggleThemePanel()"
      />

      <div
        v-if="appStore.showThemePanel"
        class="fixed z-[100] w-80 rounded-xl bg-white p-4 shadow-xl dark:bg-gray-800"
        :style="{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }"
      >
        <h3 class="mb-3 text-sm text-gray-700 font-semibold dark:text-gray-200">
          主题设置
        </h3>

        <div class="mb-3 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">深色模式</span>
          <el-switch
            :model-value="appStore.isDark"
            @change="appStore.toggleDark()"
          />
        </div>

        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="(t, accent) in appStore.accentThemes"
            :key="accent"
            class="flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-xs font-medium transition-all hover:scale-105"
            :class="{
              'ring-2 ring-offset-2': appStore.accentTheme === accent,
            }"
            :style="{
              'border-color': appStore.accentTheme === accent ? (appStore.isDark ? t.darkColor : t.color) : 'var(--app-border)',
              '--tw-ring-color': appStore.isDark ? t.darkColor : t.color,
            }"
            :title="t.label"
            @click="selectTheme(accent as AccentTheme)"
          >
            <div
              class="h-5 w-5 rounded-full"
              :style="{ background: appStore.isDark ? t.darkColor : t.color }"
            />
            <span>{{ t.label }}</span>
          </button>
        </div>

        <div class="mt-3 border-t border-gray-100 pt-3 text-center dark:border-gray-700">
          <button
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            @click="appStore.toggleThemePanel()"
          >
            关闭
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>
