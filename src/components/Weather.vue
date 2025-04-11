<template>
  <div>
    <!-- 选项卡切换 -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-tabs
              v-model="activeTab"
              bg-color="primary"
              centered
          >
            <v-tab value="temperature">温度走势</v-tab>
            <v-tab value="air">空气质量</v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- 温度图表 -->
            <v-window-item value="temperature">
              <v-card-text>
                <div ref="tempChart" style="height: 350px;"></div>
              </v-card-text>
            </v-window-item>

            <!-- 空气质量图表 -->
            <v-window-item value="air">
              <v-card-text>
                <div ref="airChart" style="height: 350px;"></div>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <!-- 天气卡片 -->
    <v-row class="mt-6">
      <v-col
          v-for="(day, index) in weatherData"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="3"
      >
        <v-card
            class="mx-auto"
            max-width="400"
            hover
            :elevation="3"
        >
          <v-card-item class="pb-0">
            <v-card-title class="text-center">
              {{ formatDate(day.date) }} {{ day.week }}
            </v-card-title>
          </v-card-item>

          <v-card-text class="text-center py-2">
            <v-icon size="x-large" :color="getWeatherIconColor(day.type)" class="mb-2">
              {{ getWeatherIcon(day.type) }}
            </v-icon>
            <div class="text-h5 font-weight-bold mb-1">
              <span class="text-red">{{ day.high }}</span> /
              <span class="text-blue">{{ day.low }}</span>
            </div>
            <div class="text-subtitle-1 mb-2">{{ day.type }}</div>
            <v-chip
                size="small"
                :color="getWindLevelColor(day.fengli)"
                class="mr-2"
            >
              {{ day.fengxiang }} {{ day.fengli }}
            </v-chip>
            <div class="text-caption mt-2">
              夜间: {{ day.night.fengxiang }} {{ day.night.fengli }}
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn variant="text" color="primary" size="small">详情</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" size="small">分享</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 空气质量卡片 -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5 text-center">
            今日空气质量
          </v-card-title>

          <v-card-text>
            <v-row align="center" justify="center" class="mb-4">
              <v-col cols="12" sm="4" class="text-center">
                <v-sheet
                    class="pa-4 rounded-circle d-inline-block"
                    :color="getAqiColor(airData.aqi)"
                    min-width="120"
                    min-height="120"
                >
                  <div class="text-h4 font-weight-bold text-white">{{ airData.aqi }}</div>
                  <div class="text-subtitle-2 text-white">{{ airData.aqi_name }}</div>
                </v-sheet>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6" sm="4" md="2" v-for="(item, index) in airItems" :key="index">
                <v-card
                    flat
                    class="text-center pa-2"
                    :color="getAirItemColor(item.value, item.threshold)"
                >
                  <div class="text-h6 font-weight-bold">{{ item.value }}</div>
                  <div class="text-caption">{{ item.label }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import {useGet} from '@/request/request.js'
import {HAN_API} from "@/request/urlConfig.js";
import {ref, onMounted, computed, watch, defineProps, watchEffect} from 'vue';
import * as echarts from 'echarts';
import {mdiWeatherSunny, mdiWeatherPartlyCloudy, mdiWeatherCloudy, mdiWeatherRainy} from '@mdi/js';
const props = defineProps({
  cityName: {
    type: String,
  }
})
// 数据部分
const weatherData = ref();

const airData = ref({
  aqi: 0,
  aqi_level: 0,
  aqi_name: "",
  co: "",
  no2: "",
  o3: "",
  pm10:"",
  pm2_5: "",
  so2:""
});

// 计算空气质量各项指标
const airItems = computed(() => [
  {label: 'PM2.5', value: airData.value.pm2_5, threshold: 75},
  {label: 'PM10', value: airData.value.pm10, threshold: 150},
  {label: 'O₃', value: airData.value.o3, threshold: 80},
  {label: 'NO₂', value: airData.value.no2, threshold: 40},
  {label: 'SO₂', value: airData.value.so2, threshold: 20},
  {label: 'CO', value: airData.value.co, threshold: 2},
]);

// 引用元素和状态
const tempChart = ref(null);
const airChart = ref(null);
const activeTab = ref('temperature');
let temperatureChart = null;
let airQualityChart = null;

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 获取天气图标
const getWeatherIcon = (type) => {
  switch (type) {
    case '晴':
      return mdiWeatherSunny;
    case '多云':
      return mdiWeatherPartlyCloudy;
    case '阴':
      return mdiWeatherCloudy;
    case '雨':
      return mdiWeatherRainy;
    default:
      return mdiWeatherPartlyCloudy;
  }
};

// 获取天气图标颜色
const getWeatherIconColor = (type) => {
  switch (type) {
    case '晴':
      return 'amber';
    case '多云':
      return 'blue-grey';
    case '阴':
      return 'grey-darken-2';
    case '雨':
      return 'blue';
    default:
      return 'blue-grey';
  }
};

// 获取风力等级对应的颜色
const getWindLevelColor = (fengli) => {
  if (fengli.includes('1-3')) return 'green';
  if (fengli.includes('3-4')) return 'amber';
  if (fengli.includes('4-5')) return 'orange';
  if (fengli.includes('5-6')) return 'deep-orange';
  if (fengli.includes('6')) return 'red';
  return 'blue-grey';
};

// 获取AQI对应的颜色
const getAqiColor = (aqi) => {
  if (aqi <= 50) return 'green';
  if (aqi <= 100) return 'lime';
  if (aqi <= 150) return 'orange';
  if (aqi <= 200) return 'deep-orange';
  if (aqi <= 300) return 'red';
  return 'purple';
};

// 获取空气质量指标对应的颜色
const getAirItemColor = (value, threshold) => {
  return value > threshold ? 'red-lighten-4' : 'green-lighten-4';
};

// 初始化温度图表
const initTemperatureChart = () => {
  if (temperatureChart) {
    temperatureChart.dispose();
  }

  temperatureChart = echarts.init(tempChart.value);

  // 提取高低温数据
  const dates = weatherData.value.map(item => formatDate(item.date));
  const highTemps = weatherData.value.map(item => parseInt(item.high));
  const lowTemps = weatherData.value.map(item => parseInt(item.low));

  const option = {
    title: {
      text: '七天温度趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['最高温', '最低温'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} °C'
      }
    },
    series: [
      {
        name: '最高温',
        type: 'line',
        data: highTemps,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#FF6B6B'
        },
        itemStyle: {
          color: '#FF6B6B'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: 'rgba(255, 107, 107, 0.5)'},
              {offset: 1, color: 'rgba(255, 107, 107, 0.1)'}
            ],
          }
        }
      },
      {
        name: '最低温',
        type: 'line',
        data: lowTemps,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#4ECDC4'
        },
        itemStyle: {
          color: '#4ECDC4'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: 'rgba(78, 205, 196, 0.5)'},
              {offset: 1, color: 'rgba(78, 205, 196, 0.1)'}
            ],
          }
        }
      }
    ]
  };

  temperatureChart.setOption(option);
};

// 初始化空气质量图表
const initAirQualityChart = () => {
  if (airQualityChart) {
    airQualityChart.dispose();
  }

  airQualityChart = echarts.init(airChart.value);

  const option = {
    title: {
      text: '空气质量详情',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: [
        {name: 'PM2.5', max: 150},
        {name: 'PM10', max: 300},
        {name: 'O₃', max: 160},
        {name: 'NO₂', max: 100},
        {name: 'SO₂', max: 50},
        {name: 'CO', max: 4}
      ],
      radius: '65%'
    },
    series: [
      {
        name: '空气质量指标',
        type: 'radar',
        data: [
          {
            value: [
              airData.value.pm2_5,
              airData.value.pm10,
              airData.value.o3,
              airData.value.no2,
              airData.value.so2,
              parseFloat(airData.value.co) * 100  // 将CO值放大以便在图上显示
            ],
            name: '当前值',
            areaStyle: {
              color: 'rgba(73, 177, 245, 0.6)'
            },
            lineStyle: {
              color: '#49B1F5'
            }
          }
        ]
      }
    ]
  };

  airQualityChart.setOption(option);
};

// 监听屏幕尺寸变化，调整图表大小
const handleResize = () => {
  if (temperatureChart) {
    temperatureChart.resize();
  }
  if (airQualityChart) {
    airQualityChart.resize();
  }
};

// 监听活动标签变化，切换图表显示
watch(activeTab, (newVal) => {
  if (newVal === 'temperature') {
    setTimeout(() => {
      initTemperatureChart();
    }, 0);
  } else if (newVal === 'air') {
    setTimeout(() => {
      initAirQualityChart();
    }, 0);
  }
});

// 获取数据
const getWeatherData = async () => {
  try {
    const {execute,data: weatherList} =  useGet(`${HAN_API.weather}/weather`, {
      params: {
        type: 'week',
        city: props.cityName
      }
    })
    await execute()
    weatherData.value = weatherList.value.data
    airData.value = weatherList.value.air
    airData.value['pm2_5'] = weatherList.value.air['pm2.5']
    initTemperatureChart();
  } catch (e) {

  }
};
watchEffect(() =>{
  getWeatherData()
})
onMounted(() => {

  // 页面加载完成后初始化温度图表
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
});
</script>

<style>
/* 可以添加额外的自定义样式 */
</style>
