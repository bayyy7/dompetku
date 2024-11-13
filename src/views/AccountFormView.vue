<!-- src/views/AccountFormView.vue -->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>{{ isEdit ? 'Edit Account' : 'Create Account' }}</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitForm" v-model="valid">
              <v-text-field
                v-model="account.name"
                label="Account Name"
                :rules="[(v) => !!v || 'Account name is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="account.number"
                label="Account Number"
                :rules="[(v) => !!v || 'Account number is required']"
                required
              ></v-text-field>
              <v-text-field
                v-model="account.balance"
                label="Initial Balance"
                type="number"
                :rules="[
                  (v) => !!v || 'Initial balance is required',
                  (v) => v >= 0 || 'Balance must be non-negative',
                ]"
                required
              ></v-text-field>

              <v-btn type="submit" color="primary" block :disabled="!valid" :loading="loading">
                {{ isEdit ? 'Update' : 'Create' }}
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
  name: 'AccountFormView',
  data() {
    return {
      account: {
        name: '',
        number: '',
        balance: 0,
      },
      valid: false,
      loading: false,
      error: null,
    }
  },
  computed: {
    isEdit() {
      return this.$route.name === 'EditAccount'
    },
  },
  async mounted() {
    if (this.isEdit) {
      try {
        const accountId = this.$route.params.id
        const response = await this.$store.dispatch('fetchAccountById', accountId)
        this.account = response.data
      } catch (error) {
        console.error('Error fetching account:', error)
      }
    }
  },
  methods: {
    async submitForm() {
      if (!this.valid) return

      this.loading = true
      this.error = null

      try {
        if (this.isEdit) {
          await this.$store.dispatch('updateAccount', {
            id: this.$route.params.id,
            data: this.account,
          })
        } else {
          await this.$store.dispatch('createAccount', this.account)
        }
        this.$router.push('/accounts')
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to save account'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
