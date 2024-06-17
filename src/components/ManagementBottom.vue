<script setup>
import {Refresh, Search} from "@element-plus/icons-vue";

defineProps({
  searchFunction: Function,
  refreshFunction: Function,
});
</script>

<template>
  <div style="margin: 10px 0;cursor: pointer;">
    <el-icon size="40px" style="margin: 0 10px" @click="searchFunction">
      <Search/>
    </el-icon>
    <el-icon size="40px" class="refresh-icon" @click="refreshFunction" style="margin: 0 10px">
      <Refresh/>
    </el-icon>
  </div>
</template>

<style scoped>
.refresh-icon {
  transform: rotate(-180deg);
  transition: 2s;
}

.refresh-icon:hover {
  transform: rotate(180deg);
  transition: 2s;
}
</style>