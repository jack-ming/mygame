<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = ref(localStorage.getItem('admin_token') || '')
const authenticated = ref(false)
const stats = ref({ total: 0, today: 0, avgScore: 0, endingDistribution: [] })
const records = ref([])
const total = ref(0)
const page = ref(0)
const pageSize = 20
const expandedId = ref(null)
const loading = ref(false)

const totalPages = computed(() => Math.ceil(total.value / pageSize))

function login() {
  localStorage.setItem('admin_token', token.value)
  authenticated.value = true
  fetchData()
  fetchStats()
}

function logout() {
  localStorage.removeItem('admin_token')
  token.value = ''
  authenticated.value = false
  records.value = []
  stats.value = { total: 0, today: 0, avgScore: 0, endingDistribution: [] }
}

async function fetchStats() {
  try {
    const res = await fetch(`/api/stats?token=${encodeURIComponent(token.value)}`)
    if (res.status === 401) {
      logout()
      return
    }
    stats.value = await res.json()
  } catch (err) {
    console.warn('Failed to fetch stats:', err)
  }
}

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch(
      `/api/records?token=${encodeURIComponent(token.value)}&limit=${pageSize}&offset=${page.value * pageSize}`
    )
    if (res.status === 401) {
      logout()
      return
    }
    const data = await res.json()
    records.value = data.records.map((r) => ({
      ...r,
      talents: safeParse(r.talents),
      flags: safeParse(r.flags),
      log: safeParse(r.log),
    }))
    total.value = data.total
  } catch (err) {
    console.warn('Failed to fetch records:', err)
  } finally {
    loading.value = false
  }
}

async function deleteRecord(id) {
  if (!confirm('确定删除这条记录吗？')) return
  try {
    await fetch(`/api/records?token=${encodeURIComponent(token.value)}&id=${id}`, {
      method: 'DELETE',
    })
    fetchData()
    fetchStats()
  } catch (err) {
    console.warn('Failed to delete record:', err)
  }
}

function safeParse(str) {
  try {
    return JSON.parse(str)
  } catch {
    return str
  }
}

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function prevPage() {
  if (page.value > 0) {
    page.value--
    fetchData()
  }
}

function nextPage() {
  if (page.value < totalPages.value - 1) {
    page.value++
    fetchData()
  }
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  if (token.value) {
    login()
  }
})
</script>

<template>
  <main class="app-shell">
    <section class="topbar">
      <div>
        <p class="eyebrow">试玩数据管理</p>
        <h1>管理后台</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-button" type="button" title="返回首页" @click="goHome">
          &#8592;
        </button>
        <button v-if="authenticated" class="icon-button" type="button" title="退出" @click="logout">
          &#10005;
        </button>
      </div>
    </section>

    <template v-if="!authenticated">
      <section class="admin-login">
        <div class="admin-login-card">
          <h2>管理员验证</h2>
          <p class="muted">请输入管理 Token 以访问后台。</p>
          <form @submit.prevent="login">
            <input v-model="token" type="password" placeholder="输入 Token" class="admin-input" />
            <button class="primary-button" type="submit">验证并登录</button>
          </form>
        </div>
      </section>
    </template>

    <template v-else>
      <section class="stats-cards">
        <div class="stat-box">
          <span class="stat-box-label">总试玩次数</span>
          <strong class="stat-box-value">{{ stats.total }}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-box-label">今日次数</span>
          <strong class="stat-box-value">{{ stats.today }}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-box-label">平均评分</span>
          <strong class="stat-box-value">{{ stats.avgScore }}</strong>
        </div>
      </section>

      <section v-if="stats.endingDistribution.length" class="ending-chart">
        <p class="section-label">结局分布</p>
        <div class="ending-bars">
          <div v-for="item in stats.endingDistribution" :key="item.ending_title" class="ending-bar-row">
            <span class="ending-bar-title">{{ item.ending_title }}</span>
            <div class="ending-bar-track">
              <div class="ending-bar-fill" :style="{ width: (item.count / stats.total * 100) + '%' }"></div>
            </div>
            <span class="ending-bar-count">{{ item.count }}</span>
          </div>
        </div>
      </section>

      <section class="records-section">
        <div class="records-header">
          <p class="section-label">试玩记录 (共 {{ total }} 条)</p>
        </div>

        <div v-if="loading" class="records-loading">加载中...</div>

        <div v-else-if="records.length === 0" class="records-empty">暂无记录</div>

        <div v-else class="records-table-wrap">
          <table class="records-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>家庭</th>
                <th>结局</th>
                <th>评分</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="record in records" :key="record.id">
                <tr>
                  <td>{{ record.created_at?.replace('T', ' ').slice(0, 19) }}</td>
                  <td>{{ record.family_name }}</td>
                  <td>{{ record.ending_title }}</td>
                  <td><strong>{{ record.composite_score }}</strong></td>
                  <td class="actions-cell">
                    <button class="action-btn" @click="toggleExpand(record.id)">
                      {{ expandedId === record.id ? '收起' : '详情' }}
                    </button>
                    <button class="action-btn action-btn-danger" @click="deleteRecord(record.id)">删除</button>
                  </td>
                </tr>
                <tr v-if="expandedId === record.id" class="detail-row">
                  <td colspan="5">
                    <div class="detail-content">
                      <div class="detail-stats">
                        <span>财富: {{ record.wealth }}</span>
                        <span>幸福: {{ record.happiness }}</span>
                        <span>健康: {{ record.health }}</span>
                        <span>学业: {{ record.study }}</span>
                        <span>事业: {{ record.career }}</span>
                        <span>商业: {{ record.business }}</span>
                        <span>艺术: {{ record.art }}</span>
                        <span>体育: {{ record.sport }}</span>
                        <span>社交: {{ record.social }}</span>
                        <span>人脉: {{ record.network }}</span>
                        <span>韧性: {{ record.grit }}</span>
                      </div>
                      <div class="detail-meta">
                        <p><strong>天赋：</strong>{{ Array.isArray(record.talents) ? record.talents.join('、') : record.talents }}</p>
                        <p><strong>结局描述：</strong>{{ record.ending_text }}</p>
                      </div>
                      <div v-if="Array.isArray(record.log) && record.log.length" class="detail-log">
                        <p class="section-label">人生记录</p>
                        <div v-for="(entry, idx) in record.log" :key="idx" :class="['detail-log-item', entry.tone]">
                          <strong>{{ entry.title }}</strong>
                          <p>{{ entry.body }}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button class="action-btn" :disabled="page === 0" @click="prevPage">上一页</button>
          <span class="pagination-info">{{ page + 1 }} / {{ totalPages }}</span>
          <button class="action-btn" :disabled="page >= totalPages - 1" @click="nextPage">下一页</button>
        </div>
      </section>
    </template>
  </main>
</template>
