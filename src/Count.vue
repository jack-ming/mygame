<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const count = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/count')
    const data = await res.json()
    count.value = data.count
  } catch {
    count.value = -1
  }
})

function goHome() {
  router.push('/')
}
</script>

<template>
  <main class="app-shell">
    <section class="topbar">
      <div>
        <p class="eyebrow">访问统计</p>
        <h1>试玩人数</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-button" type="button" title="返回首页" @click="goHome">
          &#8592;
        </button>
      </div>
    </section>

    <section class="count-card">
      <template v-if="count === null">
        <p class="muted">加载中...</p>
      </template>
      <template v-else-if="count === -1">
        <p class="muted">无法获取数据</p>
      </template>
      <template v-else>
        <strong class="count-number">{{ count }}</strong>
        <p class="muted">累计访问人次</p>
      </template>
    </section>
  </main>
</template>
