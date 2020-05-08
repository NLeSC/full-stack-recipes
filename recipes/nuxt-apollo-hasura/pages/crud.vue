<template>
  <div>
    <h2>CRUD Example with realtime Subscriptions</h2>
    <todos />
  </div>
</template>

<script>
import Todos from '~/components/Todos'
export default {
  name: 'About',
  components: { Todos },
  methods: {
    create() {},
  },
}
</script>

<style scoped></style>
