<template>
  <div>
      <div class='card-list'>
          <v-row>
               <v-col
                 v-for="(card, index) in cardData"
                 :key="index"
                 cols="12"
                 sm="6"
                 md="4"
                 lg="3"
               >
                 <v-card
                   class="mx-auto"
                   :max-width="commonCardProps.maxWidth"
                   hover
                 >
                   <v-img
                     class="align-end text-white"
                     :height="commonCardProps.imgHeight"
                     :src="card.imgSrc"
                     cover
                   >
                     <v-card-title>{{ card.title }}</v-card-title>
                   </v-img>

                   <v-card-subtitle class="pt-4">{{ card.subtitle }}</v-card-subtitle>

                   <v-card-text>
                     <div>{{ card.primaryText }}</div>
                     <div class="mt-2">{{ card.secondaryText }}</div>
                   </v-card-text>

                   <v-card-actions>
                     <v-btn :color="card.buttonColor" variant="text">{{ card.shareButtonText }}</v-btn> <!-- Vuetify 3 推荐用 variant="text" -->
                     <v-spacer></v-spacer>
                     <v-btn :color="card.buttonColor" variant="text">{{ card.exploreButtonText }}</v-btn>
                   </v-card-actions>
                 </v-card>
               </v-col>
             </v-row>
      </div>

      <Weather :city-name="cityName"/>
  </div>
</template>

<script lang="ts" setup>
import Weather from '@/components/Weather.vue';
import { cardData, commonCardProps } from '@/data/index.ts'
import {ref, watchEffect,} from "vue";
import {useGeolocation} from "@vueuse/core";
import { useAppStore } from '@/store/index.ts'
const store = useAppStore()
const { coords } = useGeolocation(
    {immediate:true,enableHighAccuracy:true}
)
const cityName = ref('郑州市')
const getCityName = (lnglat:[number,number]) =>{
  AMap.plugin("AMap.Geocoder", function () {
    const geocoder = new AMap.Geocoder();
    geocoder.getAddress(lnglat, function (status:any, result:any) {
      if (status === "complete" && result.info === "OK") {
        // result为对应的地理位置详细信息
        cityName.value = result.regeocode.addressComponent.city || '郑州市';
        store.setCity(cityName.value);
      }
    });
  });
}
watchEffect(() => {
  if (coords.value) {
    getCityName([coords.value.longitude,coords.value.latitude])
  }
})

</script>

<style scoped lang="scss">

</style>
