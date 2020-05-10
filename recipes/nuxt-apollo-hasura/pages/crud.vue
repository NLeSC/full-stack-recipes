<template>
  <div>
    <h2>CRUD Example with realtime Subscriptions</h2>
    <p>
      <a
        href="http://localhost:4000/console/data/schema/public"
        target="_blank"
      >
        Create a table
      </a>
      called 'todos' on the database with 4 columns: 'id'(Integer),
      'title'(Text) and 'is_publish'(Boolean), 'is_completed'(Boolean).
    </p>
    <v-row>
      <v-col sm="6" cols="12">
        <todos title="Public todos" type="public" />
      </v-col>
      <v-col sm="6" cols="12">
        <auth-component class="mt-3">
          <todos title="My todos" type="private" />
        </auth-component>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Todos from '~/components/Todos'
import AuthComponent from '~/components/AuthComponent'
export default {
  name: 'Crud',
  components: { AuthComponent, Todos },
}
</script>
