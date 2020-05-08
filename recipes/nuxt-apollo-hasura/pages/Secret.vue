<template>
  <div>
    <blockquote class="blockquote">
      "First, solve the problem. Then, write the code."
      <footer>
        <small>
          <em>&mdash;John Johnson</em>
        </small>
      </footer>
    </blockquote>
    <h3>Login to see this page.</h3>
  </div>
</template>

<script>
export default {
  name: 'Secret',
  middleware: 'auth',
}
</script>

<style scoped></style>
