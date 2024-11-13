<!-- src/views/ChangePasswordView.vue -->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Change Password</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="changePassword" v-model="valid">
              <v-text-field
                v-model="newPassword"
                :rules="[
                  (v) => !!v || 'New password is required',
                  (v) => v.length >= 8 || 'Password must be at least 8 characters',
                ]"
                label="New Password"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                :rules="[
                  (v) => !!v || 'Confirm password is required',
                  (v) => v === newPassword || 'Passwords must match',
                ]"
                label="Confirm Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block :disabled="!valid" :loading="loading">
                Change Password
              </v-btn>
            </v-form>
          </v-card-text>
          <v-alert v-if="error" type="error" class="ma-3">
            {{ error }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ChangePasswordView',
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      valid: false,
      loading: false,
      error: null,
    }
  },
  methods: {
    async changePassword() {
      if (!this.valid) return

      this.loading = true
      this.error = null

      try {
        await this.$store.dispatch('changePassword', this.newPassword)
        this.$router.push('/')
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to change password'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
