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

    <!--    轮播卡片-->
    <v-sheet class="mt-12">
      <v-slide-group
          show-arrows

      >
        <v-slide-group-item
            v-for="(day, index) in weatherData"
            :key="index"
            v-slot="{ isSelected, toggle }"

        >
          <v-card
              class="ma-4"
              width="400"
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
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
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
      text: '当前空气质量详情',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['PM2.5', 'PM10', 'O₃', 'NO₂', 'SO₂', 'CO'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '浓度值',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '当前值',
        type: 'bar',
        barWidth: '40%',
        data: [
          {
            value: airData.value.pm2_5,
            itemStyle: { color: '#49B1F5' }
          },
          {
            value: airData.value.pm10,
            itemStyle: { color: '#49B1F5' }
          },
          {
            value: airData.value.o3,
            itemStyle: { color: '#49B1F5' }
          },
          {
            value: airData.value.no2,
            itemStyle: { color: '#49B1F5' }
          },
          {
            value: airData.value.so2,
            itemStyle: { color: '#49B1F5' }
          },
          {
            value: parseFloat(airData.value.co) * 100, // 将CO值放大以便在图上显示
            itemStyle: { color: '#49B1F5' }
          }
        ],
        label: {
          show: true,
          position: 'top',
          formatter: '{c}'
        }
      }
    ],
    // 添加参考线，显示各指标的国标限值
    markLine: {
      data: [
        { yAxis: 75, name: 'PM2.5标准', lineStyle: { color: '#FF4500' } },
        { yAxis: 150, name: 'PM10标准', lineStyle: { color: '#FF4500' } },
        { yAxis: 100, name: 'O₃标准', lineStyle: { color: '#FF4500' } },
        { yAxis: 40, name: 'NO₂标准', lineStyle: { color: '#FF4500' } },
        { yAxis: 20, name: 'SO₂标准', lineStyle: { color: '#FF4500' } },
        { yAxis: 200, name: 'CO标准', lineStyle: { color: '#FF4500' } } // CO值已放大100倍
      ]
    }
  };

  airQualityChart.setOption(option);

  // 添加响应式处理
  window.addEventListener('resize', () => {
    airQualityChart.resize();
  });
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
