<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import api from '@/api'

const loading = ref(false)
const error = ref('')
const plants = ref<any[]>([])
const tab = ref(1) // 1=作物图鉴, 2=超变图鉴

async function loadPlants() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/game-config/Plant.json')
    if (Array.isArray(res.data)) {
      plants.value = res.data
    }
  } catch (e: any) {
    error.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
}

// Parse grow time from grow_phases string like "种子:30;发芽:30;成熟:0;"
function parseGrowTime(growPhases?: string) {
  if (!growPhases) return 0
  const parts = growPhases.split(';').filter(Boolean)
  let total = 0
  for (const p of parts) {
    const [, time] = p.split(':')
    if (time) total += Number(time)
  }
  return total // in minutes
}

// Normal plants (not mutant)
const normalPlants = computed(() =>
  plants.value.filter((p: any) => !p.mutant),
)

// Mutant plants
const mutantPlants = computed(() =>
  plants.value.filter((p: any) => p.mutant),
)

// Current display list
const displayList = computed(() =>
  tab.value === 1 ? normalPlants.value : mutantPlants.value,
)

function getGrowTimeMinutes(p: any) {
  return parseGrowTime(p.grow_phases)
}

function getExpPerHour(p: any) {
  const minutes = getGrowTimeMinutes(p)
  if (!minutes) return 0
  return ((p.exp || 0) * (p.seasons || 1)) / (minutes / 60)
}

function getImageUrl(p: any) {
  // Try to find a matching seed image
  const seedId = p.seed_id || p.id
  return `/game-config/seed_images_named/${seedId}.png`
}

const imageErrors = ref<Set<number>>(new Set())
function onImageError(id: number) {
  imageErrors.value.add(id)
}

onMounted(() => {
  loadPlants()
})
</script>

<template>
  <div class="app-page ill-page">
    <div class="ill-header">
      <h1>图鉴</h1>
      <p class="ill-subtitle">作物收集与属性一览</p>
    </div>

    <!-- Tab switch -->
    <div class="ill-tabs">
      <button class="ill-tab" :class="{ 'ill-tab-active': tab === 1 }" @click="tab = 1">
        作物图鉴
      </button>
      <button class="ill-tab" :class="{ 'ill-tab-active': tab === 2 }" @click="tab = 2">
        超变图鉴
      </button>
    </div>

    <!-- Loading / Error / Content -->
    <div v-if="loading" class="ill-state">加载中...</div>
    <div v-else-if="error" class="ill-state ill-error">{{ error }}</div>
    <div v-else class="ill-content">
      <div class="ill-count">
        共 <strong>{{ displayList.length }}</strong> 种{{ tab === 1 ? '作物' : '变异作物' }}
      </div>
      <div class="ill-grid">
        <div
          v-for="p in displayList"
          :key="p.id"
          class="ill-card"
          :title="`${p.name} — 需要土地等级 ${p.land_level_need || 1}`"
        >
          <div class="ill-card-img">
            <img
              v-if="!imageErrors.has(p.id)"
              :src="getImageUrl(p)"
              :alt="p.name"
              @error="onImageError(p.id)"
            >
            <span v-else class="ill-card-fallback">🌱</span>
          </div>
          <div class="ill-card-name">{{ p.name }}</div>
          <div class="ill-card-meta">
            <span>等级 {{ p.land_level_need || 1 }}</span>
            <span>{{ p.seasons || 1 }}季</span>
          </div>
          <div class="ill-card-time">{{ getGrowTimeMinutes(p) }}分钟</div>
          <div v-if="p.mutant" class="ill-card-mutant">{{ p.mutant }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ill-page {
  padding: 0;
  display: grid;
  gap: 16px;
}
.ill-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}
.ill-subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--app-text-muted);
}

/* Tabs */
.ill-tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-md);
  background: var(--app-surface-muted);
}
.ill-tab {
  min-height: 34px;
  padding: 0 16px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--app-text-muted);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.ill-tab-active {
  background: var(--app-surface);
  color: var(--app-accent);
  box-shadow: var(--app-shadow-soft);
}

/* State */
.ill-state {
  padding: 48px;
  text-align: center;
  color: var(--app-text-muted);
  font-size: 14px;
}
.ill-error {
  color: var(--app-danger);
}

/* Count */
.ill-count {
  font-size: 13px;
  color: var(--app-text-muted);
}
.ill-count strong {
  color: var(--app-accent);
  font-weight: 800;
}

/* Grid */
.ill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}
.ill-card {
  border: 1px solid var(--app-border);
  border-radius: var(--radius-md);
  background: var(--app-surface);
  padding: 12px;
  text-align: center;
  transition: border-color 0.14s, transform 0.14s;
}
.ill-card:hover {
  border-color: var(--app-accent);
  transform: translateY(-2px);
}
.ill-card-img {
  width: 48px;
  height: 48px;
  margin: 0 auto 8px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  background: var(--app-surface-muted);
}
.ill-card-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.ill-card-fallback {
  font-size: 24px;
}
.ill-card-name {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ill-card-meta {
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 11px;
  color: var(--app-text-muted);
  margin-bottom: 2px;
}
.ill-card-time {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--app-accent);
  font-weight: 700;
}
.ill-card-mutant {
  margin-top: 4px;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--app-accent-muted);
  color: var(--app-accent);
  display: inline-block;
}

@media (max-width: 640px) {
  .ill-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
