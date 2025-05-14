<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  games: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  highlightSecond: {
    type: Boolean,
    default: false
  }
})

function formatTime(kickoff) {
  const d = kickoff instanceof Date ? kickoff : new Date(kickoff)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput)
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d)
  const day = d.getDate()
  const suffix = (n => {
    const j = n % 10, k = n % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  })(day)
  return `${weekday} ${day}${suffix}`
}
</script>

<template>
  <section v-if="games.length" class="space-y-4">
    <div
      v-for="(g, i) in games"
      :key="g.id || i"
      :class="['game-container rounded-lg p-4 shadow']"
    >
      <p class="text-sm text-center">
        {{ formatDate(g.date) }}
      </p>
      <p class="text-center text-sm mt-2">
        Kickoff: {{ formatTime(g.kickoffTime) }} | Pitch: {{ g.pitch }}
      </p>
      <div class="match my-4 text-center">
        <RouterLink
          :to="`/team/${g.teamA}`"
          class="team-home font-semibold hover:underline"
        >
          {{ g.teamA }}
        </RouterLink>
        <span class="score mx-2">
          <span class="score-box">{{ g.score_a ?? 0 }}</span>
           : 
          <span class="score-box">{{ g.score_b ?? 0 }}</span>
        </span>
        <RouterLink
          :to="`/team/${g.teamB}`"
          class="team-away font-semibold hover:underline"
        >
          {{ g.teamB }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.game-container {
  background: #96D1F2;
  color: #231F20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:nth-child(even) {
    background: #96d1f27d;
  }
  .team-home,
  .team-away {
    color: #231F20;
  }
  .team {
    &-home {
      text-align: right;
    }
    &-away {
      text-align: left;
    }
  }
  .match {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    column-gap: 1rem;
    .score {
      text-align: center;
      font-size: 30px;
      &-box {
        background: #fff;
        padding: 5px 10px;
        border-radius: 12px;
        font-size: 25px;
      }
    }
  }
}
</style>
