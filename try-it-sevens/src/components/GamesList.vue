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
  // parse as UTC so we don’t get local (+1h DST) offsets
  const d = kickoff instanceof Date ? kickoff : new Date(kickoff)
  return d.toLocaleTimeString('en-GB', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  })
}

function formatDate(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput)

  const today = new Date()
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()

  if (isToday) return 'Today'

  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(d)
  const day = d.getDate()
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(d)

  const suffix = (n => {
    const j = n % 10, k = n % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  })(day)

  return `${weekday} ${day}${suffix} ${month}`
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
        Kickoff: <span v-if="g.kickoffTime">{{ formatTime(g.kickoffTime) }}</span><span v-else>Time TBD</span> | Pitch: {{ g.pitch }}
      </p>
      <div class="match my-4 text-center">
        <span>{{ g.teamA }}</span>
        <span class="score mx-2">
          <span class="score-box">{{ g.score_a ?? 0 }}</span>
           : 
          <span class="score-box">{{ g.score_b ?? 0 }}</span>
        </span>
        <span>{{ g.teamB }}</span>
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
