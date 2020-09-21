<template>
  <div class="container-fluid">
    <div class="row mt-5">
      <div class="col-md-6 offset-3">
        <h3>Auth Project</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum, modi.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ["session-control", "auth"],
}
</script>