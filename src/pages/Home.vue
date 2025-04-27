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
import {ref,onMounted} from "vue";
import { useAppStore } from '@/store/index.ts'
const store = useAppStore()

const cityName = ref('郑州市')
const getCityName = () =>{
    console.log('test')
  AMap.plugin("AMap.CitySearch", function () {
    const citySearch = new AMap.CitySearch();
    citySearch.getLocalCity(function(status:any, result:any){
        console.log(status,result,'testt');
      if (status === 'complete' && result.info === 'OK') {
        cityName.value = result.city;
        store.setCity(cityName.value);
      }
    });
  });
}

onMounted(()=>{
    getCityName()
})

</script>

<style scoped lang="scss">

</style>
