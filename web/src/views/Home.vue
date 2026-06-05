<script setup lang="ts">
</script>

<template>
  <div class="nc-home-redesign">
    <!-- Topbar -->
    <header class="nc-home-topbar">
      <router-link to="/home" class="nc-home-brand" aria-label="QF 农场助手首页">
        <span class="nc-home-brand-mark">
          <img src="/icon.svg" alt="">
        </span>
        <span class="nc-home-brand-copy">
          <strong>QF 农场助手</strong>
          <span>智能照看工作台</span>
        </span>
      </router-link>

      <nav class="nc-home-nav" aria-label="首页导航">
        <a href="#features">核心能力</a>
        <a href="#membership">权益管理</a>
        <a href="#start">开始使用</a>
      </nav>

      <div class="nc-home-top-actions">
        <router-link to="/login" class="nc-home-link-button">登录</router-link>
        <router-link to="/login" class="nc-home-solid-button">
          注册
          <span class="i-carbon-arrow-right" />
        </router-link>
      </div>
    </header>

    <main class="nc-home-main">
      <!-- Hero -->
      <section class="nc-home-hero" aria-labelledby="home-title">
        <div class="nc-home-hero-inner">
          <div class="nc-home-hero-copy">
            <p class="nc-home-eyebrow">
              <span class="i-carbon-sprout" />
              农场账号智能照看
            </p>
            <h1 id="home-title">QQ 农场智能助手</h1>
            <p class="nc-home-lede">
              把日常照看、多账号状态、权益额度和运行结果集中管理。个人用户上手简单，团队用户也能清楚查看自己范围内的数据。
            </p>
            <div class="nc-home-cta-row">
              <router-link to="/login" class="nc-home-primary-cta">
                进入工作台
                <span class="i-carbon-arrow-right" />
              </router-link>
              <router-link to="/login" class="nc-home-secondary-cta">
                创建账号
                <span class="i-carbon-user-follow" />
              </router-link>
            </div>
            <div class="nc-home-assurance" aria-label="平台特点">
              <span><span class="i-carbon-checkmark-filled" /> 状态实时可查</span>
              <span><span class="i-carbon-checkmark-filled" /> 权益清楚展示</span>
              <span><span class="i-carbon-checkmark-filled" /> 多端自适应</span>
            </div>
          </div>

          <aside class="nc-home-overview" aria-label="工作台概览">
            <div class="nc-home-overview-head">
              <div>
                <span>工作台概览</span>
                <strong>今日状态</strong>
              </div>
              <img src="/icon.svg" alt="">
            </div>
            <div class="nc-home-overview-list">
              <div>
                <span class="nc-home-state-dot nc-home-state-dot-ok" />
                <div>
                  <strong>账号照看</strong>
                  <small>运行状态、在线情况和异常提醒集中查看</small>
                </div>
                <b>稳定</b>
              </div>
              <div>
                <span class="nc-home-state-dot nc-home-state-dot-info" />
                <div>
                  <strong>权益额度</strong>
                  <small>会员状态、可用额度和到期提示清楚展示</small>
                </div>
                <b>清晰</b>
              </div>
              <div>
                <span class="nc-home-state-dot nc-home-state-dot-warn" />
                <div>
                  <strong>运行记录</strong>
                  <small>关键操作和结果按时间汇总，方便复查</small>
                </div>
                <b>可追踪</b>
              </div>
            </div>
            <div class="nc-home-overview-foot">
              <span>适合个人长期照看，也适合团队分级管理。</span>
              <router-link to="/login">
                查看详情 <span class="i-carbon-arrow-right" />
              </router-link>
            </div>
          </aside>
        </div>
      </section>

      <!-- Signal band -->
      <section class="nc-home-signal-band" aria-label="能力概览">
        <div>
          <strong>账号状态</strong>
          <span>在线、运行、异常一屏掌握</span>
        </div>
        <div>
          <strong>日常照看</strong>
          <span>常用农场动作集中管理</span>
        </div>
        <div>
          <strong>权益额度</strong>
          <span>会员、额度、到期清楚展示</span>
        </div>
        <div>
          <strong>团队视角</strong>
          <span>按角色查看对应用户数据</span>
        </div>
      </section>

      <!-- Features -->
      <section id="features" class="nc-home-section">
        <div class="nc-home-section-head">
          <span>CORE FEATURES</span>
          <h2>把复杂日常变成清楚的工作台</h2>
          <p>首页只展示用户需要理解的产品能力，具体实现细节留在登录后的管理页面。</p>
        </div>
        <div class="nc-home-feature-grid">
          <article>
            <span class="i-carbon-dashboard" />
            <strong>多账号状态总览</strong>
            <p>账号数量、运行状态和异常提醒统一展示，减少反复切换和人工核对。</p>
          </article>
          <article>
            <span class="i-carbon-task-complete" />
            <strong>日常照看可控</strong>
            <p>收获、种植、清理、好友互动等常用动作按清晰流程处理。</p>
          </article>
          <article>
            <span class="i-carbon-chart-bar" />
            <strong>结果记录可复查</strong>
            <p>关键操作、成功失败和最近状态保留记录，方便定位问题。</p>
          </article>
          <article>
            <span class="i-carbon-user-multiple" />
            <strong>团队数据有边界</strong>
            <p>不同身份看到对应范围的数据，用户详情、额度和状态不会混在一起。</p>
          </article>
        </div>
      </section>

      <!-- Membership -->
      <section id="membership" class="nc-home-membership">
        <div class="nc-home-membership-copy">
          <span>MEMBERSHIP</span>
          <h2>权益、额度和状态都要看得明白</h2>
          <p>公开页不暴露后台配置，只告诉用户登录后能看到什么。会员状态、可用额度、到期时间和账号运行情况都集中在工作台内。</p>
        </div>
        <div class="nc-home-membership-list">
          <div>
            <span class="i-carbon-star" />
            <strong>会员状态</strong>
            <p>清楚显示当前是否开通、剩余时间和可用权益。</p>
          </div>
          <div>
            <span class="i-carbon-license" />
            <strong>额度管理</strong>
            <p>可用数量、已使用数量和补充记录更容易核对。</p>
          </div>
          <div>
            <span class="i-carbon-user-activity" />
            <strong>运行状态</strong>
            <p>账号是否正在照看、是否在线、是否需要处理一眼可见。</p>
          </div>
        </div>
      </section>

      <!-- Start -->
      <section id="start" class="nc-home-start">
        <div>
          <span>GET STARTED</span>
          <h2>从登录到查看结果，路径保持简单</h2>
        </div>
        <div class="nc-home-start-steps">
          <article>
            <b>01</b>
            <strong>创建或登录账号</strong>
            <p>进入工作台后绑定自己的农场账号。</p>
          </article>
          <article>
            <b>02</b>
            <strong>选择照看方式</strong>
            <p>按自己的权益和额度开启对应服务。</p>
          </article>
          <article>
            <b>03</b>
            <strong>查看运行结果</strong>
            <p>通过状态、记录和提醒判断是否需要处理。</p>
          </article>
        </div>
        <div class="nc-home-start-actions">
          <router-link to="/login" class="nc-home-primary-cta">
            立即开始
            <span class="i-carbon-arrow-right" />
          </router-link>
          <router-link to="/login" class="nc-home-secondary-cta">
            已有账号登录
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.nc-home-redesign {
  --home-bg: #f6f7f4;
  --home-surface: #ffffff;
  --home-surface-soft: #eef3ef;
  --home-ink: #111a17;
  --home-muted: #5f6f68;
  --home-line: #d9e2dc;
  --home-deep: #13231f;
  --home-accent: #0f766e;
  --home-accent-dark: #0b5f59;
  --home-gold: #a16813;
  min-height: 100%;
  overflow-x: hidden;
  background: var(--home-bg);
  color: var(--home-ink);
}

html.dark .nc-home-redesign {
  --home-bg: #0d1512;
  --home-surface: #16201b;
  --home-surface-soft: #1e2b24;
  --home-ink: #e8f0ea;
  --home-muted: #8f9e97;
  --home-line: rgba(217, 226, 220, 0.12);
  --home-deep: #050a08;
  --home-accent: #32b89f;
  --home-accent-dark: #45c9b2;
  --home-gold: #f59e0b;
}

.nc-home-redesign, .nc-home-redesign * { box-sizing: border-box; }
.nc-home-redesign a { color: inherit; text-decoration: none; }

.nc-home-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  width: min(1180px, calc(100% - 40px));
  min-height: 72px;
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto minmax(220px, 1fr);
  align-items: center;
  gap: 20px;
  margin: 0 auto;
  border-bottom: 1px solid var(--home-line);
  background: color-mix(in srgb, var(--home-bg) 96%, transparent);
  backdrop-filter: blur(12px);
}

.nc-home-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nc-home-brand-mark {
  width: 42px; height: 42px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid var(--home-line);
  border-radius: 8px;
  background: var(--home-surface);
}
.nc-home-brand-mark img { width: 28px; height: 28px; display: block; object-fit: contain; }
.nc-home-brand-copy { display: grid; gap: 2px; }
.nc-home-brand-copy strong {
  color: var(--home-ink);
  font-size: 15px;
  font-weight: 840;
}
.nc-home-brand-copy span {
  color: var(--home-muted);
  font-size: 12px;
  font-weight: 680;
}
.nc-home-nav {
  justify-self: center;
  display: flex;
  gap: 4px;
  border: 1px solid var(--home-line);
  border-radius: 8px;
  background: var(--home-surface);
  padding: 4px;
}
.nc-home-nav a {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 0 12px;
  color: var(--home-muted);
  font-size: 13px;
  font-weight: 720;
  white-space: nowrap;
}
.nc-home-nav a:hover { background: var(--home-surface-soft); color: var(--home-ink); }
.nc-home-top-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.nc-home-link-button, .nc-home-solid-button,
.nc-home-primary-cta, .nc-home-secondary-cta {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--home-line);
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 780;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.14s ease;
}
.nc-home-link-button, .nc-home-secondary-cta {
  background: var(--home-surface);
  color: var(--home-ink);
}
.nc-home-solid-button, .nc-home-primary-cta {
  border-color: var(--home-accent);
  background: var(--home-accent);
  color: #fff;
}
.nc-home-link-button:hover, .nc-home-secondary-cta:hover {
  border-color: color-mix(in srgb, var(--home-accent) 38%, var(--home-line));
  background: var(--home-surface-soft);
}
.nc-home-solid-button:hover, .nc-home-primary-cta:hover {
  border-color: var(--home-accent-dark);
  background: var(--home-accent-dark);
  color: #fff;
}

.nc-home-hero {
  border-bottom: 1px solid var(--home-line);
  background: var(--home-surface);
}
.nc-home-hero-inner {
  position: relative;
  width: min(1180px, calc(100% - 40px));
  min-height: 540px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 430px);
  align-items: center;
  gap: 64px;
  margin: 0 auto;
  padding: 58px 0;
}
.nc-home-eyebrow {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  border: 1px solid var(--home-line);
  border-radius: 999px;
  background: var(--home-surface-soft);
  color: var(--home-accent-dark);
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
}
.nc-home-eyebrow span { font-size: 16px; }
.nc-home-hero h1 {
  max-width: 720px;
  margin: 24px 0 0;
  color: var(--home-ink);
  font-size: 56px;
  font-weight: 880;
  line-height: 1.08;
}
.nc-home-lede {
  max-width: 600px;
  margin: 18px 0 0;
  color: var(--home-muted);
  font-size: 16px;
  line-height: 1.8;
}
.nc-home-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}
.nc-home-primary-cta, .nc-home-secondary-cta {
  min-height: 48px;
  padding: 0 20px;
}
.nc-home-assurance {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  margin-top: 22px;
  color: var(--home-muted);
  font-size: 13px;
  font-weight: 720;
}
.nc-home-assurance > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.nc-home-assurance .i-carbon-checkmark-filled { color: var(--home-accent); }

.nc-home-overview {
  border: 1px solid var(--home-line);
  border-radius: 8px;
  background: var(--home-bg);
  box-shadow: 0 20px 48px rgba(17, 26, 23, 0.1);
  padding: 20px;
}
.nc-home-overview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--home-line);
}
.nc-home-overview-head span {
  display: block;
  color: var(--home-accent);
  font-size: 12px;
  font-weight: 840;
}
.nc-home-overview-head strong {
  display: block;
  margin-top: 4px;
  color: var(--home-ink);
  font-size: 24px;
  font-weight: 860;
}
.nc-home-overview-head img {
  width: 48px; height: 48px;
  border: 1px solid var(--home-line);
  border-radius: 8px;
  background: var(--home-surface);
  padding: 8px;
  object-fit: contain;
}
.nc-home-overview-list { display: grid; }
.nc-home-overview-list > div {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--home-line);
  padding: 16px 0;
}
.nc-home-overview-list > div:last-child { border-bottom: none; }
.nc-home-state-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.nc-home-state-dot-ok { background: var(--home-accent); }
.nc-home-state-dot-info { background: #37556b; }
.nc-home-state-dot-warn { background: var(--home-gold); }
.nc-home-overview-list strong {
  display: block;
  color: var(--home-ink);
  font-size: 15px;
  font-weight: 840;
}
.nc-home-overview-list small {
  display: block;
  margin-top: 3px;
  color: var(--home-muted);
  font-size: 12px;
}
.nc-home-overview-list b {
  color: var(--home-ink);
  font-size: 13px;
  font-weight: 820;
  white-space: nowrap;
}
.nc-home-overview-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
}
.nc-home-overview-foot > span {
  color: var(--home-muted);
  font-size: 12px;
}
.nc-home-overview-foot a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--home-accent);
  font-size: 13px;
  font-weight: 800;
}

.nc-home-signal-band {
  width: min(1180px, calc(100% - 40px));
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 22px auto 0;
}
.nc-home-signal-band > div {
  border: 1px solid var(--home-line);
  border-radius: 8px;
  background: var(--home-surface);
  box-shadow: 0 10px 24px rgba(17, 26, 23, 0.04);
  padding: 16px;
}
.nc-home-signal-band strong {
  display: block;
  color: var(--home-ink);
  font-size: 15px;
  font-weight: 840;
}
.nc-home-signal-band span {
  display: block;
  margin-top: 5px;
  color: var(--home-muted);
  font-size: 12px;
}

.nc-home-section {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 76px 0 72px;
}
.nc-home-section-head { max-width: 700px; }
.nc-home-section-head span, .nc-home-membership-copy span, .nc-home-start > div:first-child span {
  display: block;
  color: var(--home-accent);
  font-size: 12px;
  font-weight: 840;
}
.nc-home-section-head h2, .nc-home-membership-copy h2, .nc-home-start h2 {
  margin: 10px 0 0;
  color: var(--home-ink);
  font-size: 36px;
  font-weight: 860;
  line-height: 1.2;
}
.nc-home-section-head p, .nc-home-membership-copy p {
  margin: 10px 0 0;
  color: var(--home-muted);
  font-size: 14px;
  line-height: 1.75;
}
.nc-home-feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 28px;
}
.nc-home-feature-grid article,
.nc-home-membership-list > div,
.nc-home-start-steps article {
  border: 1px solid var(--home-line);
  border-radius: 8px;
  background: var(--home-surface);
  box-shadow: 0 10px 24px rgba(17, 26, 23, 0.04);
  padding: 18px;
}
.nc-home-feature-grid article > span,
.nc-home-membership-list > div > span {
  width: 42px; height: 42px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  border: 1px solid var(--home-line);
  border-radius: 8px;
  background: var(--home-surface-soft);
  color: var(--home-accent);
  font-size: 20px;
}
.nc-home-feature-grid p, .nc-home-membership-list p, .nc-home-start-steps p {
  margin: 8px 0 0;
  color: var(--home-muted);
  font-size: 14px;
  line-height: 1.7;
}

.nc-home-membership {
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  align-items: center;
  gap: 54px;
  padding: 74px max(20px, calc((100% - 1180px) / 2));
  background: var(--home-deep);
}
.nc-home-membership-copy h2, .nc-home-membership-list strong { color: #fff; }
.nc-home-membership-copy span { color: #8bd4c5; }
.nc-home-membership-copy p, .nc-home-membership-list p { color: rgba(255, 255, 255, 0.7); }
.nc-home-membership-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.nc-home-membership-list > div {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
}
.nc-home-membership-list > div > span {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: #8bd4c5;
}

.nc-home-start {
  width: min(1180px, calc(100% - 40px));
  display: grid;
  grid-template-columns: 0.86fr 1.14fr;
  gap: 28px;
  margin: 0 auto;
  padding: 76px 0 86px;
}
.nc-home-start h2 { margin: 10px 0 0; }
.nc-home-start-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.nc-home-start-steps b {
  display: block;
  margin-bottom: 24px;
  color: var(--home-gold);
  font-size: 13px;
  font-weight: 880;
}
.nc-home-start-steps strong {
  display: block;
  color: var(--home-ink);
  font-size: 15px;
  font-weight: 840;
}
.nc-home-start-actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 2px;
}

@media (max-width: 1024px) {
  .nc-home-topbar { grid-template-columns: 1fr auto; }
  .nc-home-nav { display: none; }
  .nc-home-hero-inner { grid-template-columns: 1fr; gap: 36px; min-height: 0; }
  .nc-home-hero h1 { font-size: 46px; }
  .nc-home-overview { max-width: 560px; }
  .nc-home-signal-band, .nc-home-feature-grid, .nc-home-membership-list { grid-template-columns: repeat(2, 1fr); }
  .nc-home-membership, .nc-home-start { grid-template-columns: 1fr; }
  .nc-home-start-actions { padding-top: 14px; }
}

@media (max-width: 720px) {
  .nc-home-topbar, .nc-home-hero-inner, .nc-home-signal-band, .nc-home-section, .nc-home-start {
    width: min(calc(100% - 24px), 1180px);
  }
  .nc-home-topbar {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px 0;
  }
  .nc-home-top-actions { width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .nc-home-hero-inner { padding: 42px 0 34px; }
  .nc-home-hero h1 { font-size: 34px; }
  .nc-home-lede { font-size: 14px; }
  .nc-home-cta-row, .nc-home-start-actions { display: grid; grid-template-columns: 1fr; }
  .nc-home-primary-cta, .nc-home-secondary-cta { width: 100%; }
  .nc-home-overview { display: none; }
  .nc-home-signal-band, .nc-home-feature-grid, .nc-home-membership-list, .nc-home-start-steps { grid-template-columns: 1fr; }
  .nc-home-section { padding: 56px 0 54px; }
  .nc-home-section-head h2, .nc-home-membership-copy h2, .nc-home-start h2 { font-size: 28px; }
  .nc-home-membership { gap: 28px; padding: 54px 12px; }
  .nc-home-start { padding: 56px 0 64px; }
}
</style>
