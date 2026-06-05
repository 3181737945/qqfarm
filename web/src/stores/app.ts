import type { Component } from 'vue'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  Sunny,
  Moon,
  StarFilled,
  ChromeFilled,
} from '@element-plus/icons-vue'
import api from '@/api'

const THEME_KEY = 'ui_theme'
const ACCENT_KEY = 'ui_accent_theme'

export type Theme = 'light' | 'dark'
export type AccentTheme = 'teal' | 'blue' | 'green' | 'orange' | 'rose' | 'mono'

const accentThemes: Record<AccentTheme, {
  label: string
  color: string
  darkColor: string
}> = {
  teal: { label: '默认青绿', color: '#0f766e', darkColor: '#32b89f' },
  blue: { label: '经典蓝', color: '#2563eb', darkColor: '#60a5fa' },
  green: { label: '清爽绿', color: '#16a34a', darkColor: '#4ade80' },
  orange: { label: '暖橙', color: '#ea580c', darkColor: '#fb923c' },
  rose: { label: '樱桃红', color: '#e11d48', darkColor: '#fb7185' },
  mono: { label: '黑白灰', color: '#374151', darkColor: '#9ca3af' },
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    Number.parseInt(h.substring(0, 2), 16),
    Number.parseInt(h.substring(2, 4), 16),
    Number.parseInt(h.substring(4, 6), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')}`
}

function mixColors(color1: string, color2: string, weight: number): string {
  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)
  const w = weight / 100
  return rgbToHex(
    r1 * (1 - w) + r2 * w,
    g1 * (1 - w) + g2 * w,
    b1 * (1 - w) + b2 * w,
  )
}

export const useAppStore = defineStore('app', () => {
  const sidebarOpen = ref(false)
  const isDark = ref(localStorage.getItem(THEME_KEY) === 'dark')
  const accentTheme = ref<AccentTheme>(
    (localStorage.getItem(ACCENT_KEY) as AccentTheme) || 'teal',
  )
  const showThemePanel = ref(false)

  function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
  function closeSidebar() { sidebarOpen.value = false }
  function openSidebar() { sidebarOpen.value = true }

  function applyTheme(dark: boolean, accent: AccentTheme) {
    isDark.value = dark
    accentTheme.value = accent
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    localStorage.setItem(ACCENT_KEY, accent)

    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    root.dataset.accentTheme = accent

    const a = accentThemes[accent]
    const accentColor = dark ? a.darkColor : a.color

    root.style.setProperty('--app-accent', accentColor)
    root.style.setProperty('--app-accent-hover', mixColors(accentColor, dark ? '#ffffff' : '#000000', 15))
    root.style.setProperty('--app-accent-muted', dark
      ? `rgba(${hexToRgb(accentColor).join(', ')}, 0.14)`
      : mixColors(accentColor, '#ffffff', 85))

    // Element Plus bridges
    root.style.setProperty('--el-color-primary', accentColor)
    root.style.setProperty('--el-color-primary-light-3', mixColors(accentColor, dark ? '#0d1512' : '#ffffff', 30))
    root.style.setProperty('--el-color-primary-light-5', mixColors(accentColor, dark ? '#0d1512' : '#ffffff', 50))
    root.style.setProperty('--el-color-primary-light-7', mixColors(accentColor, dark ? '#0d1512' : '#ffffff', 70))
    root.style.setProperty('--el-color-primary-light-8', mixColors(accentColor, dark ? '#0d1512' : '#ffffff', 80))
    root.style.setProperty('--el-color-primary-light-9', mixColors(accentColor, dark ? '#0d1512' : '#ffffff', 90))
    root.style.setProperty('--el-color-primary-dark-2', mixColors(accentColor, '#000000', 20))
    root.style.setProperty('--app-accent-strong', mixColors(accentColor, '#000000', 20))
  }

  function toggleDark() {
    applyTheme(!isDark.value, accentTheme.value)
  }

  function setAccentTheme(accent: AccentTheme) {
    applyTheme(isDark.value, accent)
  }

  function toggleThemePanel() { showThemePanel.value = !showThemePanel.value }

  async function fetchTheme() {
    try {
      const res = await api.get('/api/settings')
      if (res.data.ok && res.data.data.ui?.theme) {
        // Server theme available but prefer local
      }
    }
    catch {
      // Silent fail
    }
  }

  // Init
  applyTheme(isDark.value, accentTheme.value)

  return {
    sidebarOpen,
    isDark,
    accentTheme,
    showThemePanel,
    accentThemes,
    applyTheme,
    toggleDark,
    setAccentTheme,
    toggleThemePanel,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    fetchTheme,
  }
})
