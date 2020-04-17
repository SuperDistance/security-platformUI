<template>
  <div class="layout">
    <myHeader></myHeader>
    <myMenue></myMenue>
    <transition name="fade" mode="out-in">
    <router-view></router-view>
    </transition>
    <myFooter></myFooter>
  </div>
</template>

<script>
import myFooter from '../components/myfooter'
import myMenue from '../components/Menue'
import myHeader from '../components/myheader'
export default {
  name: 'base',
  components: { myFooter, myHeader, myMenue }
}
</script>
