<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useAccountStore } from '@/stores/account'
import { useBagStore } from '@/stores/bag'
import { useStatusStore } from '@/stores/status'
import { useToastStore } from '@/stores/toast'

const statusStore = useStatusStore()
const accountStore = useAccountStore()
const bagStore = useBagStore()
const toast = useToastStore()
const {
  status,
  logs: statusLogs,
  accountLogs: statusAccountLogs,
  realtimeConnected,
} = storeToRefs(statusStore)
const { currentAccountId, currentAccount } = storeToRefs(accountStore)
const { dashboardItems } = storeToRefs(bagStore)
const logContainer = ref<any>(null)
const autoScroll = ref(true)
const lastBagFetchAt = ref(0)
const clearingLogs = ref(false)

// Log modules and events
const modules = [
  { label: '所有模块', value: '' },
  { label: '农场', value: 'farm' },
  { label: '好友', value: 'friend' },
  { label: '仓库', value: 'warehouse' },
  { label: '任务', value: 'task' },
  { label: '系统', value: 'system' },
]

const events = [
  { label: '所有事件', value: '' },
  { label: '巡查', value: 'cycle' },
  { label: '种植', value: 'plant' },
  { label: '收获', value: 'harvest' },
  { label: '出售', value: 'sell' },
  { label: '偷菜', value: 'steal' },
  { label: '购买', value: 'buy' },
  { label: '任务', value: 'task' },
  { label: '错误', value: 'error' },
]

const logLevels = [
  { label: '所有等级', value: '' },
  { label: '普通', value: 'info' },
  { label: '警告', value: 'warn' },
]

const filter = reactive({
  module: '',
  event: '',
  keyword: '',
  isWarn: '',
})

const hasActiveLogFilter = computed(() =>
  !!(filter.module || filter.event || filter.keyword || filter.isWarn),
)

const allLogs = computed(() => {
  const sLogs = statusLogs.value || []
  const aLogs = (statusAccountLogs.value || []).map((l: any) => ({
    ts: new Date(l.time).getTime(),
    time: l.time,
    tag: l.action === 'Error' ? '错误' : '系统',
    msg: l.reason ? `${l.msg} (${l.reason})` : l.msg,
  }))
  return [...sLogs, ...aLogs].sort((a: any, b: any) => a.ts - b.ts)
})

// Overview data
const displayName = computed(() => {
  const acc = currentAccount.value
  if (!acc) return '未选择账号'
  return acc.nick || acc.name || acc.uin || '未知'
})

const expPercent = computed(() => {
  const lp = status.value?.levelProgress
  if (!lp || !lp.needed) return 0
  return Math.min(100, Math.round((lp.current / lp.needed) * 100))
})

const uptimeStr = computed(() => {
  const s = status.value?.uptime || 0
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
})

const expPerHour = computed(() => {
  const gained = status.value?.sessionExpGained || 0
  const sec = status.value?.uptime || 0
  if (!sec) return '0/时'
  const h = sec / 3600
  return h > 0 ? `${Math.floor(gained / h)}/时` : '0/时'
})

const levelUpEta = computed(() => {
  const gained = status.value?.sessionExpGained || 0
  const sec = status.value?.uptime || 0
  const lp = status.value?.levelProgress
  if (!lp?.needed || !sec || gained <= 0) return ''
  const h = sec / 3600
  const perHour = h > 0 ? gained / h : 0
  if (perHour <= 0) return ''
  const remaining = lp.needed - lp.current
  const minutes = (remaining / (perHour / 60))
  return minutes < 60
    ? `约 ${Math.ceil(minutes)} 分钟后升级`
    : `约 ${(minutes / 60).toFixed(1)} 小时后升级`
})

const resources = computed(() => [
  { label: '金币', value: status.value?.status?.gold || 0, delta: status.value?.sessionGoldGained || 0 },
  { label: '点券', value: status.value?.status?.coupon || 0, delta: status.value?.sessionCouponGained || 0 },
  { label: '金豆', value: status.value?.status?.goldBean ?? 0, delta: status.value?.sessionGoldBeanGained || 0 },
])

const nextFarmCheck = computed(() => {
  const nc = status.value?.nextChecks
  if (!nc) return '--:--:--'
  return formatCountdown(nc.farmRemainSec)
})

const nextFriendCheck = computed(() => {
  const nc = status.value?.nextChecks
  if (!nc) return '--:--:--'
  return formatCountdown(nc.friendRemainSec)
})

// 秒转小时
function fmtHours(seconds: number) {
  if (!seconds && seconds !== 0) return '-'
  const hours = seconds / 3600
  return hours.toFixed(1) + '小时'
}

function formatCountdown(sec?: number) {
  if (sec === undefined || sec === null) return '--:--:--'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Operations
const operations = computed(() => {
  const ops = status.value?.operations || {}
  return Object.entries(ops)
    .filter(([, v]) => Number(v) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
})

const operationLabels: Record<string, string> = {
  harvest: '收获', plant: '种植', steal: '偷菜',
  water: '浇水', weed: '除草', bug: '除虫',
  fertilize: '施肥', sell: '出售', taskClaim: '任务',
  helpWater: '帮浇水', helpWeed: '帮除草', helpBug: '帮除虫',
}

function getOpLabel(key: string) {
  return operationLabels[key] || key
}

// Log fetching
let lastLogFetch = 0
const logsLoading = ref(false)

async function fetchLogs(force = false) {
  if (!currentAccountId.value) return
  const now = Date.now()
  if (!force && now - lastLogFetch < 3000) return
  lastLogFetch = now
  logsLoading.value = true
  try {
    await statusStore.fetchLogs(currentAccountId.value, {
      module: filter.module || undefined,
      event: filter.event || undefined,
      keyword: filter.keyword || undefined,
      isWarn: filter.isWarn === 'warn' ? true : filter.isWarn === 'info' ? false : undefined,
    })
  } finally {
    logsLoading.value = false
  }
}

async function fetchStatus() {
  if (!currentAccountId.value) return
  await statusStore.fetchStatus(currentAccountId.value)
  await statusStore.fetchAccountLogs()
}

async function fetchBag() {
  if (!currentAccountId.value || !currentAccount.value?.running) return
  const now = Date.now()
  if (now - lastBagFetchAt.value < 2000) return
  lastBagFetchAt.value = now
  await bagStore.fetchBag(currentAccountId.value)
}

const showClearConfirm = ref(false)
const clearLogsLoading = ref(false)

async function handleClearLogs() {
  if (!currentAccountId.value) return
  try {
    clearLogsLoading.value = true
    const res = await statusStore.clearLogs(currentAccountId.value)
    toast.success(`已清空 ${Number(res?.cleared) || 0} 条日志`)
    showClearConfirm.value = false
    await fetchLogs(true)
  } catch (e: any) {
    toast.error(e?.message || '清空失败')
  } finally {
    clearLogsLoading.value = false
  }
}

// Watch for account changes
watch(currentAccountId, () => {
  fetchStatus()
  fetchLogs()
})

watch(() => status.value?.connection?.connected, (connected) => {
  if (connected) fetchBag()
})

// Auto-refresh
useIntervalFn(fetchLogs, 5000)
useIntervalFn(fetchStatus, 10000)

onMounted(() => {
  fetchStatus()
  fetchLogs()
})
</script>

<template>
  <div class="app-page dash-page">
    <!-- Account Overview -->
    <section class="dash-overview">
      <div class="dash-overview-card dash-account-card">
        <div class="dash-account-head">
          <span class="dash-eyebrow">当前账号</span>
          <span class="dash-level-badge">Lv.{{ status?.status?.level || 0 }}</span>
        </div>
        <h2 class="dash-account-name">{{ displayName }}</h2>
        <div class="dash-account-row">
          <span
            class="dash-state-dot"
            :class="status?.connection?.connected ? 'dash-state-on' : 'dash-state-off'"
          />
          <span>{{ status?.connection?.connected ? '在线' : '离线' }}</span>
          <span class="dash-uptime">{{ uptimeStr }}</span>
        </div>
        <div class="dash-exp-block">
          <div class="dash-exp-header">
            <span>经验进度</span>
            <span class="font-mono">{{ status?.levelProgress?.current || 0 }} / {{ status?.levelProgress?.needed || '?' }}</span>
          </div>
          <div class="dash-exp-bar-bg">
            <div class="dash-exp-bar-fill" :style="{ width: expPercent + '%' }" />
          </div>
          <div class="dash-exp-footer">
            <span>{{ expPerHour }}</span>
            <span v-if="levelUpEta" class="dash-exp-eta">{{ levelUpEta }}</span>
          </div>
        </div>
      </div>

      <!-- Resources -->
      <div class="dash-overview-card">
        <div class="dash-card-head">
          <span>资产资源</span>
          <small>本次变化</small>
        </div>
        <div class="dash-resources">
          <div
            v-for="r in resources"
            :key="r.label"
            class="dash-resource-row"
          >
            <span>{{ r.label }}</span>
            <strong>{{ r.value.toLocaleString() }}</strong>
            <em v-if="r.delta !== 0" :class="r.delta > 0 ? 'text-green-600' : 'text-red-500'">
              {{ r.delta > 0 ? '+' : '' }}{{ r.delta }}
            </em>
          </div>
        </div>
      </div>

      <!-- Cycle -->
      <div class="dash-overview-card">
        <div class="dash-card-head">
          <span>巡查节奏</span>
          <small>下一轮</small>
        </div>
        <div class="dash-cycle">
          <div>
            <span>农场</span>
            <strong>{{ nextFarmCheck }}</strong>
          </div>
          <div>
            <span>好友</span>
            <strong>{{ nextFriendCheck }}</strong>
          </div>
        </div>
        <div class="dash-cycle-items" style="margin-top: 12px; display: grid; gap: 6px;">
<!-- 化肥容器直接显示原始数据 -->
          <div v-for="item in dashboardItems?.slice(0, 4) || []" :key="item.id" style="display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid var(--app-border-subtle);">
            <span style="color: var(--app-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.name }}</span>
            <strong style="font-family: var(--font-mono);">
              {{ item.id === 1011 || item.id === 1012 ? fmtHours(item.count) : item.count }}
            </strong>
          </div>
          <div v-if="!dashboardItems?.length" style="text-align: center; padding: 16px; color: var(--app-text-muted); font-size: 12px;">
            暂无数据
          </div>
        </div>
      </div>

      <!-- Operations -->
      <div class="dash-overview-card">
        <div class="dash-card-head">
          <span>今日操作</span>
          <small>{{ operations.length }} 类</small>
        </div>
        <div v-if="status?.connection?.connected" class="dash-ops">
          <div v-for="[key, val] in operations" :key="key" class="dash-op-row">
            <span>{{ getOpLabel(key) }}</span>
            <strong>{{ val }}</strong>
          </div>
          <div v-if="operations.length === 0" class="dash-empty-hint">
            等待任务统计
          </div>
        </div>
        <div v-else class="dash-empty-hint">
          账号未运行
        </div>
      </div>
    </section>

    <!-- Logs Section -->
    <section class="dash-logs-section">
      <div class="dash-logs-head">
        <div>
          <h3>运行日志</h3>
          <span class="dash-logs-count">{{ allLogs.length }} 条记录</span>
          <span v-if="hasActiveLogFilter" class="dash-logs-filtered">筛选中</span>
          <span v-else class="dash-logs-live">实时同步</span>
        </div>
        <div class="dash-logs-actions">
          <!-- Filters toggle -->
          <button class="dash-btn" :class="{ 'dash-btn-active': hasActiveLogFilter }" @click="filter.module = ''; filter.event = ''; filter.keyword = ''; filter.isWarn = ''; fetchLogs(true)">
            <span class="i-carbon-filter" />
            <span>筛选</span>
          </button>
          <button class="dash-btn" :class="{ 'dash-btn-active': !autoScroll }" @click="autoScroll = !autoScroll">
            <span :class="autoScroll ? 'i-carbon-pause' : 'i-carbon-arrow-down'" />
            <span>{{ autoScroll ? '暂停' : '跟随' }}</span>
          </button>
          <button class="dash-btn dash-btn-danger" :disabled="clearingLogs" @click="showClearConfirm = true">
            <span class="i-carbon-trash-can" />
            <span>清空</span>
          </button>
        </div>
      </div>

      <!-- Filter row -->
      <div class="dash-filter-row">
        <select v-model="filter.module" class="dash-select" @change="fetchLogs(true)">
          <option v-for="m in modules" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
        <select v-model="filter.event" class="dash-select" @change="fetchLogs(true)">
          <option v-for="e in events" :key="e.value" :value="e.value">{{ e.label }}</option>
        </select>
        <select v-model="filter.isWarn" class="dash-select" @change="fetchLogs(true)">
          <option v-for="l in logLevels" :key="l.value" :value="l.value">{{ l.label }}</option>
        </select>
        <div class="dash-search">
          <span class="i-carbon-search" />
          <input v-model="filter.keyword" placeholder="搜索..." @keyup.enter="fetchLogs(true)">
          <button v-if="filter.keyword" class="dash-search-clear" @click="filter.keyword = ''; fetchLogs(true)">
            <span class="i-carbon-close" />
          </button>
        </div>
        <button class="dash-btn dash-btn-primary" @click="fetchLogs(true)">
          <span class="i-carbon-search" />
          <span>搜索</span>
        </button>
      </div>

      <!-- Log entries -->
      <div ref="logContainer" class="dash-log-viewport" @scroll.passive="() => {}">
        <div v-if="allLogs.length === 0" class="dash-log-empty">
          <span class="i-carbon-document-blank" />
          <strong>暂无日志</strong>
          <span v-if="hasActiveLogFilter">当前筛选没有匹配记录</span>
          <span v-else>账号运行后会在这里显示实时事件</span>
        </div>
        <template v-else>
          <!-- Desktop table head -->
          <div class="dash-log-header">
            <span>时间</span>
            <span>模块</span>
            <span>事件</span>
            <span>内容</span>
          </div>
          <div
            v-for="(log, idx) in allLogs"
            :key="log.ts + '-' + idx"
            class="dash-log-entry"
          >
            <span class="dash-log-time">{{ log.time?.split(' ')[1]?.split('.')[0] || log.time }}</span>
            <span
              class="dash-log-tag"
              :class="{
                'dash-tag-ok': log.tag !== '错误' && log.tag !== '警告',
                'dash-tag-warn': log.tag === '警告',
                'dash-tag-danger': log.tag === '错误',
              }"
            >{{ log.tag || '系统' }}</span>
            <span class="dash-log-event">{{ log.meta?.event || '-' }}</span>
            <span class="dash-log-msg">{{ log.msg }}</span>
          </div>
        </template>
      </div>
    </section>

    <!-- Confirm Modal -->
    <ConfirmModal
      :show="showClearConfirm"
      :loading="clearLogsLoading"
      title="确认清空日志"
      message="确定清空当前账号的运行日志吗？此操作不可恢复。"
      type="danger"
      @confirm="handleClearLogs"
      @cancel="showClearConfirm = false"
    />
  </div>
</template>

<style scoped>
.dash-page {
  display: grid;
  gap: 20px;
  padding: 0;
}

/* Overview grid */
.dash-overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.dash-overview-card {
  border: 1px solid var(--app-border);
  border-radius: var(--radius-md);
  background: var(--app-surface);
  padding: 18px;
}

/* Account card */
.dash-account-card { grid-column: span 1; }
.dash-account-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.dash-eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--app-text-muted);
}
.dash-level-badge {
  font-size: 12px;
  font-weight: 800;
  color: var(--app-accent);
}
.dash-account-name {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dash-account-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--app-text-muted);
  margin-bottom: 14px;
}
.dash-state-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dash-state-on { background: #22c55e; }
.dash-state-off { background: #9ca3af; }
.dash-uptime { margin-left: auto; font-family: var(--font-mono); }

/* Exp block */
.dash-exp-block {
  border-top: 1px solid var(--app-border);
  padding-top: 12px;
}
.dash-exp-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--app-text-muted);
  margin-bottom: 6px;
}
.dash-exp-bar-bg {
  height: 6px;
  border-radius: 3px;
  background: var(--app-surface-muted);
  overflow: hidden;
}
.dash-exp-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--app-accent);
  transition: width 0.5s ease;
}
.dash-exp-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--app-text-muted);
  margin-top: 6px;
}
.dash-exp-eta { color: var(--app-accent); }

/* Card head */
.dash-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.dash-card-head span { font-size: 12px; font-weight: 700; color: var(--app-text-muted); }
.dash-card-head small { font-size: 11px; color: var(--app-text-muted); }

/* Resources */
.dash-resources { display: grid; gap: 8px; }
.dash-resource-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
  font-size: 13px;
}
.dash-resource-row strong {
  font-size: 16px;
  font-weight: 800;
  font-family: var(--font-mono);
}
.dash-resource-row em {
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
}

/* Cycle */
.dash-cycle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.dash-cycle > div {
  padding: 10px;
  border-radius: var(--radius-sm);
  background: var(--app-surface-muted);
  text-align: center;
}
.dash-cycle > div span {
  display: block;
  font-size: 11px;
  color: var(--app-text-muted);
  margin-bottom: 4px;
}
.dash-cycle > div strong {
  font-size: 18px;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--app-accent);
}

/* Operations */
.dash-ops { display: grid; gap: 6px; }
.dash-op-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--app-border-subtle);
  font-size: 13px;
}
.dash-op-row:last-child { border-bottom: none; }
.dash-op-row strong {
  font-weight: 800;
  color: var(--app-accent);
}
.dash-empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
  color: var(--app-text-muted);
  font-size: 13px;
}

/* Logs Section */
.dash-logs-section {
  border: 1px solid var(--app-border);
  border-radius: var(--radius-md);
  background: var(--app-surface);
  overflow: hidden;
}
.dash-logs-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--app-border);
}
.dash-logs-head > div {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dash-logs-head h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}
.dash-logs-count {
  font-size: 12px;
  color: var(--app-text-muted);
}
.dash-logs-filtered { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: var(--app-accent-muted); color: var(--app-accent); font-weight: 700; }
.dash-logs-live { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: var(--app-surface-muted); color: var(--app-text-muted); }
.dash-logs-actions {
  display: flex;
  gap: 6px;
}

/* Buttons */
.dash-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid var(--app-border);
  border-radius: var(--radius-sm);
  background: var(--app-surface);
  color: var(--app-text-muted);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.14s;
  white-space: nowrap;
}
.dash-btn:hover { border-color: var(--app-accent); color: var(--app-accent); }
.dash-btn-active { border-color: var(--app-accent); background: var(--app-accent-muted); color: var(--app-accent); }
.dash-btn-primary { border-color: var(--app-accent); background: var(--app-accent); color: #fff; }
.dash-btn-primary:hover { background: var(--app-accent-hover); }
.dash-btn-danger { color: var(--app-danger); }
.dash-btn-danger:hover { border-color: var(--app-danger); background: var(--color-danger-muted); }
.dash-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Filter row */
.dash-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface-muted);
}
.dash-select {
  min-height: 32px;
  padding: 0 8px;
  border: 1px solid var(--app-border);
  border-radius: var(--radius-sm);
  background: var(--app-surface);
  font-size: 12px;
  color: var(--app-text);
  outline: none;
}
.dash-search {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 160px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid var(--app-border);
  border-radius: var(--radius-sm);
  background: var(--app-surface);
}
.dash-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
  color: var(--app-text);
  min-width: 0;
}
.dash-search input::placeholder { color: var(--app-text-muted); }
.dash-search-clear {
  display: flex;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--app-text-muted);
  font-size: 14px;
  padding: 0;
}

/* Log viewport */
.dash-log-viewport {
  max-height: 520px;
  overflow-y: auto;
  padding: 0 18px;
}
.dash-log-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 0;
  color: var(--app-text-muted);
  font-size: 13px;
}
.dash-log-empty strong { font-size: 15px; }
.dash-log-empty .i-carbon-document-blank { font-size: 32px; opacity: 0.3; }

/* Log header (desktop) */
.dash-log-header {
  display: grid;
  grid-template-columns: 94px 76px 100px 1fr;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface-muted);
  color: var(--app-text-muted);
  font-size: 12px;
  font-weight: 700;
  padding: 10px 0;
}
.dash-log-entry {
  display: grid;
  grid-template-columns: 94px 76px 100px 1fr;
  gap: 12px;
  align-items: baseline;
  border-bottom: 1px solid var(--app-border-subtle);
  padding: 8px 0;
  font-size: 13px;
  word-break: break-word;
}
.dash-log-entry:hover { background: var(--app-surface-muted); margin: 0 -18px; padding: 8px 18px; }
.dash-log-time {
  font-size: 12px;
  color: var(--app-text-muted);
  font-family: var(--font-mono);
}
.dash-log-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  padding: 1px 8px;
  text-align: center;
  width: fit-content;
}
.dash-tag-ok { background: var(--app-accent-muted); color: var(--app-accent); }
.dash-tag-warn { background: rgba(161, 104, 19, 0.12); color: var(--app-warning); }
.dash-tag-danger { background: rgba(220, 38, 38, 0.1); color: var(--app-danger); }
.dash-log-event { font-size: 12px; color: var(--app-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dash-log-msg { line-height: 1.5; overflow-wrap: anywhere; }

@media (max-width: 820px) {
  .dash-overview { grid-template-columns: 1fr; }
  .dash-log-header { display: none; }
  .dash-log-entry {
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 12px;
    margin: 0 -18px;
    padding: 12px 18px;
  }
  .dash-log-time { font-size: 11px; }
  .dash-logs-head { flex-direction: column; align-items: flex-start; }
  .dash-filter-row { flex-direction: column; }
  .dash-search { min-width: 0; }
}
</style>
