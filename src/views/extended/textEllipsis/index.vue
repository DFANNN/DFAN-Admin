<template>
  <div class="text-ellipsis-doc-container">
    <el-card shadow="never">
      <TextEllipsis :text="text1" :line="2" :clickable="true" tooltipType="element" />
      <TextEllipsisA :text="text1" tooltipType="element" :clickable="true" />
      <div class="tooltip-container">
        这是一段文本
        <div class="tooltip-text">展示的文本</div>
      </div>
      <div>12314</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import TextEllipsisA from '@/components/text/TextEllipsis copy.vue'

defineOptions({ name: 'TextEllipsisView' })

const text = ref(
  '在一个寂静的小镇上，少年李安每天都会经过那棵古老的橡树。橡树枝叶繁茂，仿佛守护着小镇的秘密。一天傍晚，李安在树下发现一个闪着微光的盒子。盒子里有一张旧地图和一把小钥匙。地图指向小镇的另一端，那里有一座废弃的磨坊。李安怀着好奇心，决定跟随地图去探索。他推开磨坊的大门，发现里面布满尘埃，但角落里有一个小箱子，正好与钥匙匹配。箱子打开的一瞬间，阳光透过破碎的窗户洒在箱子里的金色信封上。信封里写着：“勇敢的人，终会找到属于自己的奇迹。”李安心里涌起一股温暖，他明白，冒险的意义不仅在于发现，更在于勇气与希望。',
)

const text1 = ref('这是一段文本')
</script>

<style scoped lang="scss">
.text-ellipsis-doc-container {
  flex: 1;
  display: flex;
  .el-card {
    flex: 1;
  }
}
</style>
