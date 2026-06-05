<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/api'
import { useAccountStore } from '@/stores/account'
import { useStatusStore } from '@/stores/status'

const accountStore = useAccountStore()
const statusStore = useStatusStore()
const { status, realtimeConnected } = storeToRefs(statusStore)
const { currentAccountId, currentAccount, accounts } = storeToRefs(accountStore)

const loading = ref(false)
const error = ref('')
const tab = ref<'overview' | 'analytics'>('overview')
const analytics = ref<any[]>([])
const analyticsSort = ref('exp')

// Computed stats
const totalAccounts = computed(() => accounts.value.length)
const runningAccounts = computed(() => accounts.value.filter((a: any) => a.running).length)
const offlineAccounts = computed(() => totalAccounts.value - runningAccounts.value)

const currentOps = computed(() => {
  const ops = status.value?.operations || {}
  return Object.entries(ops).filter(([, v]) => Number(v) > 0)
})

const operationLabels: Record<string, string> = {
  harvest: '收获', plant: '种植', steal: '偷菜',
  water: '浇水', weed: '除草', bug: '除虫',
  fertilize: '施肥', sell: '出售', taskClaim: '任务',
  helpWater: '帮浇水', helpWeed: '帮除草', helpBug: '帮除虫',
}

function formatNumber(n: number) {
  if (!n && n !== 0) return '-'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString()
}

async function fetchAnalytics() {
  try {
    const res = await api.get('/api/analytics', { params: { sort: analyticsSort.value } })
    if (res.data.ok) {
      analytics.value = res.data.data || []
    }
  } catch (e) {
    console.error(e)
  }
}

async function refresh() {
  if (!currentAccountId.value) return
  loading.value = true
  error.value = ''
  try {
    await statusStore.fetchStatus(currentAccountId.value)
  } catch (e: any) {
    error.value = e.message || '获取数据失败'
  } finally {
    loading.value = false
  }
}

watch(tab, (val) => {
  if (val === 'analytics') fetchAnalytics()
})

watch(currentAccountId, () => {
  refresh()
})

onMounted(() => {
  accountStore.fetchAccounts()
  refresh()
})
</script>

<template>
  <div class="app-page stats-page">
    <div class="stats-header">
      <h1>数据统计</h1>
      <p class="stats-subtitle">多账号运行数据概览</p>
    </div>

    <!-- Account summary cards -->
    <div class="stats-summary">
      <div class="stats-card">
        <div class="stats-card-label">账号总数</div>
        <div class="stats-card-value stats-card-value-accent">{{ totalAccounts }}</div>
      </div>
      <div class="stats-card">
        <div class="stats-card-label">运行中</div>
        <div class="stats-card-value stats-card-value-green">{{ runningAccounts }}</div>
      </div>
      <div class="stats-card">
        <div class="stats-card-label">已离线</div>
        <div class="stats-card-value stats-card-value-muted">{{ offlineAccounts }}</div>
      </div>
      <div class="stats-card">
        <div class="stats-card-label">在线率</div>
        <div class="stats-card-value">
          {{ totalAccounts > 0 ? Math.round(runningAccounts / totalAccounts * 100) : 0 }}%
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="stats-tabs">
      <button class="stats-tab" :class="{ 'stats-tab-active': tab === 'overview' }" @click="tab = 'overview'">
        运行概览
      </button>
      <button class="stats-tab" :class="{ 'stats-tab-active': tab === 'analytics' }" @click="tab = 'analytics'">
        种植排名
      </button>
    </div>

    <!-- Overview tab -->
    <div v-if="tab === 'overview'" class="stats-content">
      <!-- Account list -->
      <div class="stats-section-title">账号列表</div>
      <div class="stats-account-grid">
        <div
          v-for="acc in accounts"
          :key="acc.id"
          class="stats-account-card"
          :class="{ 'stats-account-active': currentAccountId === (acc.id || acc.uin) }"
          @click="accountStore.setCurrentAccount(acc)"
        >
          <div class="stats-account-top">
            <div class="stats-account-avatar">
              <img v-if="acc.avatar" :src="acc.avatar" alt="">
              <span v-else>👤</span>
            </div>
            <div class="stats-account-info">
              <div class="stats-account-name">{{ acc.nick || acc.name || acc.uin || '未知' }}</div>
              <div class="stats-account-meta">
                <span class="stats-platform-tag">{{ acc.platform === 'qq' ? 'QQ' : '微信' }}</span>
                <span class="stats-account-uin">{{ acc.uin || acc.id }}</span>
              </div>
            </div>
          </div>
          <div class="stats-account-status">
            <span class="stats-status-dot" :class="acc.running ? 'stats-status-on' : 'stats-status-off'" />
            <span>{{ acc.running ? '运行中' : '已停止' }}</span>
          </div>
        </div>
        <div v-if="accounts.length === 0" class="stats-empty">
          暂无账号，请在设置页添加
        </div>
      </div>

      <!-- Selected account details -->
      <template v-if="currentAccount">
        <div class="stats-section-title" style="margin-top: 20px;">
          当前账号: {{ currentAccount.nick || currentAccount.name || currentAccount.uin }}
        </div>

        <div v-if="loading" class="stats-loading">
          <span class="i-carbon-loading" /> 加载中...
        </div>
        <div v-else-if="error" class="stats-error">
          {{ error }}
        </div>
        <div v-else-if="!status?.connection?.connected" class="stats-empty">
          账号未运行，启动后查看数据
        </div>
        <div v-else class="stats-detail">
          <!-- Detail cards -->
          <div class="stats-detail-grid">
            <div class="stats-detail-card">
              <span class="stats-detail-label">等级</span>
              <span class="stats-detail-value">Lv.{{ status?.status?.level || 0 }}</span>
            </div>
            <div class="stats-detail-card">
              <span class="stats-detail-label">经验值</span>
              <span class="stats-detail-value">{{ formatNumber(status?.levelProgress?.current || 0) }}</span>
            </div>
            <div class="stats-detail-card">
              <span class="stats-detail-label">金币</span>
              <span class="stats-detail-value stats-gold">{{ formatNumber(status?.status?.gold || 0) }}</span>
            </div>
            <div class="stats-detail-card">
              <span class="stats-detail-label">点券</span>
              <span class="stats-detail-value stats-coupon">{{ formatNumber(status?.status?.coupon || 0) }}</span>
            </div>
          </div>

          <!-- Operations summary -->
          <div class="stats-ops">
            <div class="stats-section-title">本日操作（{{ currentOps.length }} 类）</div>
            <div v-if="currentOps.length > 0" class="stats-ops-grid">
              <div v-for="[key, val] in currentOps" :key="key" class="stats-op-item">
                <span class="stats-op-label">{{ operationLabels[key] || key }}</span>
                <span class="stats-op-value">{{ val }}</span>
              </div>
            </div>
            <div v-else class="stats-empty" style="padding: 16px;">
              暂无操作数据
            </div>
          </div>

          <!-- Session info -->
          <div class="stats-session">
            <div class="stats-section-title">本次运行</div>
            <div class="stats-session-grid">
              <div class="stats-session-item">
                <span>运行时间</span>
                <strong>{{ Math.floor((status?.uptime || 0) / 60) }} 分钟</strong>
              </div>
              <div class="stats-session-item">
                <span>经验获得</span>
                <strong>+{{ formatNumber(status?.sessionExpGained || 0) }}</strong>
              </div>
              <div class="stats-session-item">
                <span>金币获得</span>
                <strong class="stats-gold">+{{ formatNumber(status?.sessionGoldGained || 0) }}</strong>
              </div>
              <div class="stats-session-item">
                <span>点券获得</span>
                <strong class="stats-coupon">+{{ formatNumber(status?.sessionCouponGained || 0) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Analytics tab -->
    <div v-if="tab === 'analytics'" class="stats-content">
      <div class="stats-sort-row">
        <label>排序方式：</label>
        <select v-model="analyticsSort" class="stats-select" @change="fetchAnalytics">
          <option value="exp">按经验效率</option>
          <option value="profit">按利润效率</option>
          <option value="fertilizer_exp">施肥经验效率</option>
          <option value="fertilizer_profit">施肥利润效率</option>
        </select>
      </div>

      <div v-if="analytics.length > 0" class="stats-table-wrapper">
        <div class="stats-table-header">
          <span class="stats-th" style="flex: 2;">作物</span>
          <span class="stats-th">等级</span>
          <span class="stats-th">时间</span>
          <span class="stats-th">季数</span>
          <span class="stats-th">经验/时</span>
          <span class="stats-th">利润/时</span>
        </div>
        <div
          v-for="(item, idx) in analytics.slice(0, 20)"
          :key="item.name || idx"
          class="stats-table-row"
        >
          <span class="stats-td" style="flex: 2; font-weight: 700;">{{ item.name || item.plantName || '未知' }}</span>
          <span class="stats-td">{{ item.level || '-' }}</span>
          <span class="stats-td">{{ item.growTime || item.grow_time || '-' }}</span>
          <span class="stats-td">{{ item.seasons || item.harvest_times || 1 }}</span>
          <span class="stats-td stats-td-highlight">{{ formatNumber(item.expPerHour || item.exp_per_hour || 0) }}</span>
          <span class="stats-td stats-td-highlight">{{ formatNumber(item.profitPerHour || item.profit_per_hour || 0) }}</span>
        </div>
      </div>
      <div v-else class="stats-empty">
        <span class="i-carbon-chart-bar" style="font-size: 32px; opacity: 0.3;" />
        <span>暂无作物数据</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-page {
  display: grid;
  gap: 18px;
  padding: 0;
}

.stats-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}
.stats-subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--app-text-muted);
}

/* Summary */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.stats-card {
  border: 1px solid var(--app-border);
  border-radius: var(--radius-md);
  background: var(--app-surface);
  padding: 16px;
  text-align: center;
}
.stats-card-label {
  font-size: 12px;
  color: var(--app-text-muted);
  font-weight: 700;
  margin-bottom: 6px;
}
.stats-card-value {
  font-size: 28px;
  font-weight: 800;
  font-family: var(--font-mono);
}
.stats-card-value-accent { color: var(--app-accent); }
.stats-card-value-green { color: #22c55e; }
.stats-card-value-muted { color: var(--app-text-muted); }

/* Tabs */
.stats-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-md);
  background: var(--app-surface-muted);
  width: fit-content;
}
.stats-tab {
  min-height: 34px;
  padding: 0 14px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--app-text-muted);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.14s;
}
.stats-tab-active {
  background: var(--app-surface);
  color: var(--app-accent);
  box-shadow: var(--app-shadow-soft);
}

/* Account grid */
.stats-account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}
.stats-account-card {
  border: 1px solid var(--app-border);
  border-radius: var(--radius-md);
  background: var(--app-surface);
  padding: 14px;
  cursor: pointer;
  transition: border-color 0.14s, background 0.14s;
}
.stats-account-card:hover {
  border-color: var(--app-accent);
}
.stats-account-active {
  border-color: var(--app-accent);
  background: var(--app-accent-muted);
}
.stats-account-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.stats-account-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  background: var(--app-surface-muted);
  display: grid;
  place-items: center;
  overflow: hidden;
  font-size: 16px;
}
.stats-account-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.stats-account-info {
  min-width: 0;
  flex: 1;
}
.stats-account-name {
  font-size: 14px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stats-account-meta {
  display: flex;
  gap: 6px;
  font-size: 11px;
  margin-top: 2px;
}
.stats-platform-tag {
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--app-surface-muted);
  color: var(--app-text-muted);
}
.stats-account-uin {
  color: var(--app-text-muted);
}
.stats-account-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--app-text-muted);
}
.stats-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.stats-status-on { background: #22c55e; }
.stats-status-off { background: #9ca3af; }

/* Detail section */
.stats-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}
.stats-detail-card {
  border: 1px solid var(--app-border);
  border-radius: var(--radius-md);
  background: var(--app-surface);
  padding: 14px;
  text-align: center;
}
.stats-detail-label {
  display: block;
  font-size: 11px;
  color: var(--app-text-muted);
  font-weight: 700;
  margin-bottom: 4px;
}
.stats-detail-value {
  font-size: 22px;
  font-weight: 800;
  font-family: var(--font-mono);
}
.stats-gold { color: var(--app-warning); }
.stats-coupon { color: var(--app-accent); }

/* Section title */
.stats-section-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 10px;
  color: var(--app-text);
}

/* Operations */
.stats-ops-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.stats-op-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--app-border-subtle);
  border-radius: var(--radius-sm);
  background: var(--app-surface);
  font-size: 13px;
}
.stats-op-value {
  font-weight: 800;
  color: var(--app-accent);
}

/* Session */
.stats-session-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.stats-session-item {
  padding: 10px 12px;
  border: 1px solid var(--app-border-subtle);
  border-radius: var(--radius-sm);
  background: var(--app-surface);
}
.stats-session-item span {
  display: block;
  font-size: 11px;
  color: var(--app-text-muted);
  margin-bottom: 2px;
}
.stats-session-item strong {
  font-size: 15px;
  font-weight: 800;
}

/* Analytics */
.stats-sort-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.stats-select {
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid var(--app-border);
  border-radius: var(--radius-sm);
  background: var(--app-surface);
  color: var(--app-text);
  font-size: 13px;
  outline: none;
}
.stats-table-wrapper {
  border: 1px solid var(--app-border);
  border-radius: var(--radius-md);
  background: var(--app-surface);
  overflow: hidden;
}
.stats-table-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: var(--app-surface-muted);
  font-size: 12px;
  font-weight: 700;
  color: var(--app-text-muted);
}
.stats-th {
  flex: 1;
  min-width: 0;
}
.stats-table-row {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-top: 1px solid var(--app-border-subtle);
  font-size: 13px;
}
.stats-table-row:hover { background: var(--app-surface-muted); }
.stats-td {
  flex: 1;
  min-width: 0;
}
.stats-td-highlight {
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--app-accent);
}

/* States */
.stats-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 32px;
  color: var(--app-text-muted);
  font-size: 14px;
}
.stats-error {
  padding: 24px;
  color: var(--app-danger);
  font-size: 14px;
}
.stats-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 0;
  color: var(--app-text-muted);
  font-size: 14px;
}

@media (max-width: 640px) {
  .stats-summary { grid-template-columns: repeat(2, 1fr); }
  .stats-account-grid { grid-template-columns: 1fr; }
  .stats-detail-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-session-grid { grid-template-columns: 1fr; }
}
</style>
