<!-- src/views/AccountsView.vue -->
<template>
  <v-container>
    <v-row justify="space-between" class="mb-4">
      <v-col>
        <h1 class="text-h4">Accounts</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" to="/account/create"> Create Account </v-btn>
      </v-col>
    </v-row>

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Account Name</th>
          <th class="text-left">Account Number</th>
          <th class="text-left">Balance</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in accounts" :key="account.id">
          <td>{{ account.name }}</td>
          <td>{{ account.number }}</td>
          <td>Rp {{ account.balance.toLocaleString() }}</td>
          <td class="text-right">
            <v-btn color="primary" size="small" :to="`/account/edit/${account.id}`"> Edit </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
export default {
  name: 'AccountsView',
  data() {
    return {
      accounts: [],
    }
  },
  async mounted() {
    try {
      const response = await this.$store.dispatch('fetchAccounts')
      this.accounts = response.data
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  },
}
</script>
