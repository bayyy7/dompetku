<template>
  <v-app>
    <v-main>
      <PersonalFinanceTracker />
    </v-main>
  </v-app>
</template>

<script>
import PersonalFinanceTracker from './components/PersonalFinanceTracker.vue'

export default {
  name: 'App',
  components: {
    PersonalFinanceTracker,
  },
}
</script>
