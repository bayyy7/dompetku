<!-- src/views/HomeView.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">
            Welcome, {{ user?.username }}!
            <v-spacer></v-spacer>
            <v-btn color="error" @click="handleLogout"> Logout </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-card variant="outlined">
                  <v-card-title>Balance</v-card-title>
                  <v-card-text class="text-h5">
                    Rp {{ user?.balance?.toLocaleString() }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Navigation Menu -->
            <v-row class="mt-4">
              <v-col cols="12" md="4">
                <v-btn block color="primary" class="mb-2" to="/dompetku"> Dompetku </v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn block color="secondary" class="mb-2" to="/accounts"> Manage Accounts </v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn block color="info" class="mb-2" to="/change-password">
                  Change Password
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HomeView',
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    async handleLogout() {
      await this.$store.dispatch('logout')
      this.$router.push('/login')
    },
  },
  async mounted() {
    if (!this.user) {
      await this.$store.dispatch('getUserInfo')
    }
  },
}
</script>
