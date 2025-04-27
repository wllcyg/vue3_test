<template>
  <div class="travel-guide-container">
    <v-container>
      <!-- 标题区域 -->
      <v-row class="mb-6">
        <v-col
          cols="12"
          class="text-center"
        >
          <h1 class="text-h3 font-weight-bold primary--text mb-2">威海五一自驾游攻略</h1>
          <p class="text-subtitle-1">精心规划的两天行程，带您领略威海的美丽风光</p>

          <!-- 天气信息卡片 -->
          <v-card
            class="mt-4 mx-auto"
            max-width="800"
            elevation="3"
          >
            <v-card-title class="text-center">
              <v-icon
                large
                color="primary"
                class="mr-2"
              >mdi-weather-partly-cloudy</v-icon>
              威海三日天气预报
            </v-card-title>
            <v-card-text>
              <div class="d-flex justify-center align-center">
                <v-btn
                  @click="getWeatherInfo"
                  color="primary"
                  variant="outlined"
                  class="mb-4"
                >
                  <v-icon left>mdi-refresh</v-icon>获取最新天气
                </v-btn>
              </div>

              <!-- 三日天气预报卡片组 -->
              <v-slide-group
                v-if="forecastData.length > 0"
                show-arrows
                class="mt-2"
              >
                <v-slide-group-item
                  v-for="(day, index) in forecastData"
                  :key="index"
                >
                  <v-card
                    class="ma-2"
                    min-width="200"
                    max-width="250"
                    hover
                    :elevation="2"
                  >
                    <v-card-item class="pb-0">
                      <v-card-title class="text-center text-body-1">
                        {{ formatDate(day.date) }} {{ getDayOfWeek(day.date) }}
                      </v-card-title>
                    </v-card-item>

                    <v-card-text class="text-center py-2">
                      <v-icon
                        size="x-large"
                        :color="getWeatherIconColor(day.dayWeather)"
                        class="mb-2"
                      >
                        {{ getWeatherIcon(day.dayWeather) }}
                      </v-icon>
                      <div class="text-h6 font-weight-bold mb-1">
                        <span class="text-red">{{ day.dayTemp }}°</span> /
                        <span class="text-blue">{{ day.nightTemp }}°</span>
                      </div>
                      <div class="text-subtitle-2 mb-2">{{ day.dayWeather }}</div>
                      <v-chip
                        size="small"
                        :color="getWindLevelColor(day.dayWindPower)"
                        class="mr-2"
                      >
                        {{ day.dayWindDirection }} {{ day.dayWindPower }}级
                      </v-chip>
                    </v-card-text>
                  </v-card>
                </v-slide-group-item>
              </v-slide-group>

              <!-- 当前天气信息 -->
              <div
                v-if="weatherInfo && forecastData.length === 0"
                class="text-center"
              >
                <div class="text-h4 font-weight-bold">{{ weatherInfo.temp }}°C</div>
                <div class="text-subtitle-1">{{ weatherInfo.weather }}</div>
                <div class="text-body-2 mt-2">
                  <span>湿度: {{ weatherInfo.humidity }}%</span> |
                  <span>风力: {{ weatherInfo.windLevel }}</span>
                </div>
              </div>

              <div
                v-if="!weatherInfo && forecastData.length === 0"
                class="text-center text-body-1"
              >
                点击上方按钮获取威海最新天气信息
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 行程规划 -->
      <v-row>
        <v-col cols="12">
          <v-tabs
            v-model="activeTab"
            bg-color="primary"
            centered
          >
            <v-tab value="day1">第一天行程</v-tab>
            <v-tab value="day2">第二天行程</v-tab>
            <v-tab value="map">地图路线</v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- 第一天行程 -->
            <v-window-item value="day1">
              <v-card flat>
                <v-card-text>
                  <h2 class="text-h5 font-weight-bold mb-4">第一天：海滨风光游</h2>

                  <div
                    v-for="(spot, index) in day1Spots"
                    :key="index"
                    class="mb-6"
                  >
                    <v-card
                      elevation="2"
                      class="spot-card"
                    >
                      <div class="d-flex flex-wrap">
                        <div class="spot-image">
                          <v-img
                            :src="spot.image"
                            height="200"
                            cover
                          ></v-img>
                        </div>
                        <div class="spot-content pa-4">
                          <div class="d-flex align-center mb-2">
                            <v-chip
                              color="primary"
                              class="mr-2"
                            >{{ index + 1 }}</v-chip>
                            <h3 class="text-h6 font-weight-bold">{{ spot.name }}</h3>
                          </div>
                          <p class="text-body-1 mb-2">{{ spot.description }}</p>
                          <div class="d-flex align-center">
                            <v-icon
                              small
                              color="amber-darken-2"
                              class="mr-1"
                            >mdi-clock-outline</v-icon>
                            <span class="text-caption">建议游玩时间: {{ spot.duration }}</span>
                          </div>
                          <div class="d-flex align-center mt-1">
                            <v-icon
                              small
                              color="blue"
                              class="mr-1"
                            >mdi-map-marker</v-icon>
                            <span class="text-caption">{{ spot.location }}</span>
                          </div>
                          <div class="mt-2">
                            <v-chip-group>
                              <v-chip
                                v-for="(tag, i) in spot.tags"
                                :key="i"
                                size="small"
                                color="primary"
                                variant="outlined"
                              >
                                {{ tag }}
                              </v-chip>
                            </v-chip-group>
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- 第二天行程 -->
            <v-window-item value="day2">
              <v-card flat>
                <v-card-text>
                  <h2 class="text-h5 font-weight-bold mb-4">第二天：人文历史游</h2>

                  <div
                    v-for="(spot, index) in day2Spots"
                    :key="index"
                    class="mb-6"
                  >
                    <v-card
                      elevation="2"
                      class="spot-card"
                    >
                      <div class="d-flex flex-wrap">
                        <div class="spot-image">
                          <v-img
                            :src="spot.image"
                            height="200"
                            cover
                          ></v-img>
                        </div>
                        <div class="spot-content pa-4">
                          <div class="d-flex align-center mb-2">
                            <v-chip
                              color="primary"
                              class="mr-2"
                            >{{ index + 1 }}</v-chip>
                            <h3 class="text-h6 font-weight-bold">{{ spot.name }}</h3>
                          </div>
                          <p class="text-body-1 mb-2">{{ spot.description }}</p>
                          <div class="d-flex align-center">
                            <v-icon
                              small
                              color="amber-darken-2"
                              class="mr-1"
                            >mdi-clock-outline</v-icon>
                            <span class="text-caption">建议游玩时间: {{ spot.duration }}</span>
                          </div>
                          <div class="d-flex align-center mt-1">
                            <v-icon
                              small
                              color="blue"
                              class="mr-1"
                            >mdi-map-marker</v-icon>
                            <span class="text-caption">{{ spot.location }}</span>
                          </div>
                          <div class="mt-2">
                            <v-chip-group>
                              <v-chip
                                v-for="(tag, i) in spot.tags"
                                :key="i"
                                size="small"
                                color="primary"
                                variant="outlined"
                              >
                                {{ tag }}
                              </v-chip>
                            </v-chip-group>
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- 地图路线 -->
            <v-window-item value="map">
              <v-card flat>
                <v-card-text>
                  <h2 class="text-h5 font-weight-bold mb-4">威海自驾游路线图</h2>

                  <div class="d-flex justify-center mb-4">
                    <v-btn-group>
                      <v-btn
                        @click="showRoute(1)"
                        :color="selectedDay === 1 ? 'primary' : ''"
                      >
                        第一天路线
                      </v-btn>
                      <v-btn
                        @click="showRoute(2)"
                        :color="selectedDay === 2 ? 'primary' : ''"
                      >
                        第二天路线
                      </v-btn>
                    </v-btn-group>
                  </div>

                  <div class="map-container">
                    <div
                      id="map-container"
                      class="map-element"
                    ></div>
                  </div>

                  <div class="mt-4">
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-icon class="mr-2">mdi-information-outline</v-icon>
                            自驾游贴士
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <ul class="text-body-1">
                            <li>提前检查车辆状况，确保安全行驶</li>
                            <li>准备好导航设备，下载离线地图</li>
                            <li>景区周边停车场可能较为拥挤，建议提前到达</li>
                            <li>带好防晒用品，威海日照时间较长</li>
                            <li>准备一些零食和饮用水，方便途中补充能量</li>
                          </ul>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.travel-guide-container {
  max-width: 100%;
  overflow-x: hidden;
}

.spot-card {
  transition: all 0.3s ease;
}

.spot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.spot-image {
  width: 100%;
}

.spot-content {
  width: 100%;
}

.map-container {
  width: 100%;
  height: 500px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.map-element {
  width: 100%;
  height: 100%;
}

/* 响应式布局 */
@media (min-width: 768px) {
  .spot-image {
    width: 40%;
  }

  .spot-content {
    width: 60%;
  }
}
</style>

<script setup>
import { ref, onMounted, watch } from "vue";
import { loadAMap } from "@/utils/mapLoader";

// 组件挂载时初始化地图
onMounted(() => {
  // 延迟初始化地图，确保DOM已经渲染
  setTimeout(() => {
    initMap();
  }, 500);
});

// 天气信息
const weatherInfo = ref(null);
// 天气预报数据
const forecastData = ref([]);

/**
 * 获取威海天气信息
 * 使用高德地图天气API获取威海的实时天气和三天预报数据
 */
const getWeatherInfo = async () => {
  try {
    // 确保高德地图API已加载
    await loadAMap(["AMap.Weather"]);

    // 创建天气查询实例
    const weather = new AMap.Weather();

    // 查询实时天气
    weather.getLive("威海", (status, result) => {
      if (result) {
        const liveData = result;
        weatherInfo.value = {
          temp: liveData.temperature,
          weather: liveData.weather,
          humidity: liveData.humidity,
          windLevel: liveData.windPower,
        };
      } else {
        console.error("获取实时天气信息失败:", result);
      }
    });

    // 查询天气预报
    weather.getForecast("威海", (status, result) => {
      if (result && result.forecasts) {
        // 获取未来三天的天气预报
        forecastData.value = result.forecasts.slice(0, 3).map((forecast) => ({
          date: forecast.date,
          dayTemp: forecast.dayTemp,
          nightTemp: forecast.nightTemp,
          dayWeather: forecast.dayWeather,
          nightWeather: forecast.nightWeather,
          dayWindDirection: forecast.dayWindDir,
          nightWindDirection: forecast.nightWindDir,
          dayWindPower: forecast.dayWindPower,
          nightWindPower: forecast.nightWindPower,
        }));
      } else {
        console.error("获取天气预报信息失败:", result);
      }
    });
  } catch (error) {
    console.error("获取天气信息失败:", error);
  }
};

/**
 * 格式化日期
 * @param {string} dateStr - 日期字符串，格式为 YYYY-MM-DD
 * @returns {string} 格式化后的日期，格式为 MM/DD
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/**
 * 获取星期几
 * @param {string} dateStr - 日期字符串，格式为 YYYY-MM-DD
 * @returns {string} 星期几
 */
const getDayOfWeek = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekdays[date.getDay()];
};

/**
 * 根据天气类型获取对应的图标
 * @param {string} type - 天气类型
 * @returns {string} 对应的图标名称
 */
const getWeatherIcon = (type) => {
  const iconMap = {
    晴: "mdi-weather-sunny",
    多云: "mdi-weather-partly-cloudy",
    阴: "mdi-weather-cloudy",
    阵雨: "mdi-weather-pouring",
    雷阵雨: "mdi-weather-lightning-rainy",
    小雨: "mdi-weather-rainy",
    中雨: "mdi-weather-pouring",
    大雨: "mdi-weather-pouring",
    暴雨: "mdi-weather-pouring",
    雨夹雪: "mdi-weather-snowy-rainy",
    小雪: "mdi-weather-snowy",
    中雪: "mdi-weather-snowy",
    大雪: "mdi-weather-snowy-heavy",
    暴雪: "mdi-weather-snowy-heavy",
    雾: "mdi-weather-fog",
    霾: "mdi-weather-hazy",
  };

  return iconMap[type] || "mdi-weather-partly-cloudy";
};

/**
 * 根据天气类型获取对应的图标颜色
 * @param {string} type - 天气类型
 * @returns {string} 对应的颜色
 */
const getWeatherIconColor = (type) => {
  const colorMap = {
    晴: "amber-darken-2",
    多云: "blue-lighten-3",
    阴: "grey",
    阵雨: "blue",
    雷阵雨: "deep-purple",
    小雨: "blue",
    中雨: "blue-darken-1",
    大雨: "blue-darken-2",
    暴雨: "blue-darken-3",
    雨夹雪: "light-blue",
    小雪: "light-blue-lighten-3",
    中雪: "light-blue-lighten-2",
    大雪: "light-blue",
    暴雪: "light-blue-darken-1",
    雾: "grey-lighten-1",
    霾: "brown-lighten-1",
  };

  return colorMap[type] || "blue-grey";
};

/**
 * 根据风力等级获取对应的颜色
 * @param {string} level - 风力等级
 * @returns {string} 对应的颜色
 */
const getWindLevelColor = (level) => {
  const levelNum = parseInt(level) || 0;
  if (levelNum <= 3) return "green";
  if (levelNum <= 5) return "amber";
  if (levelNum <= 7) return "orange";
  return "red";
};

// 标签页控制
const activeTab = ref("day1");

// 选择的天数（用于地图显示）
const selectedDay = ref(1);

// 第一天景点数据
const day1Spots = ref([
  {
    name: "刘公岛",
    description:
      "刘公岛是甲午战争的历史见证地，岛上保存着大量的历史遗迹，包括甲午战争博物馆、刘公岛炮台等，是了解中国近代史的重要场所。",
    image: "https://picsum.photos/800/600?random=10",
    duration: "3-4小时",
    location: "威海市环翠区刘公岛",
    tags: ["历史", "海岛", "博物馆"],
    coordinates: [122.1189, 37.5004],
  },
  {
    name: "威海国际海水浴场",
    description:
      "威海国际海水浴场是威海最著名的海滩之一，沙质细腻，海水清澈，是夏季游泳、沙滩娱乐的理想去处。",
    image: "https://picsum.photos/800/600?random=11",
    duration: "2-3小时",
    location: "威海市环翠区海滨路",
    tags: ["海滩", "休闲", "游泳"],
    coordinates: [122.0583, 37.5075],
  },
  {
    name: "威海海洋公园",
    description:
      "威海海洋公园是一个集海洋生物展示、科普教育和娱乐为一体的主题公园，可以近距离观赏各种海洋生物。",
    image: "https://picsum.photos/800/600?random=12",
    duration: "2-3小时",
    location: "威海市环翠区海滨北路",
    tags: ["海洋", "科普", "家庭"],
    coordinates: [122.0483, 37.5175],
  },
]);

// 第二天景点数据
const day2Spots = ref([
  {
    name: "成山头",
    description:
      '成山头被誉为"天尽头，海尽头，中国的尽头"，是中国大陆最东端的海岬，可以欣赏到壮观的日出景象。',
    image: "https://picsum.photos/800/600?random=13",
    duration: "3-4小时",
    location: "威海市荣成市成山镇",
    tags: ["自然风光", "日出", "地标"],
    coordinates: [122.5858, 37.4037],
  },
  {
    name: "华夏城",
    description:
      "华夏城是一个以中华文化为主题的大型文化旅游景区，展示了中国古代建筑和传统文化。",
    image: "https://picsum.photos/800/600?random=14",
    duration: "3-4小时",
    location: "威海市环翠区文化西路",
    tags: ["文化", "历史", "建筑"],
    coordinates: [122.0789, 37.5204],
  },
  {
    name: "威海韩乐坊",
    description:
      "威海韩乐坊是一个韩国风情街区，汇集了众多韩国美食、服饰和文化体验，是感受韩国文化的好去处。",
    image: "https://picsum.photos/800/600?random=15",
    duration: "2-3小时",
    location: "威海市环翠区青岛中路",
    tags: ["韩国风情", "美食", "购物"],
    coordinates: [122.1089, 37.5104],
  },
]);

// 地图对象
let map = null;
// 驾车路线规划实例
let driving = null;

/**
 * 初始化地图
 * 加载高德地图API并创建地图实例
 */
const initMap = async () => {
  // 确保地图容器存在
  const mapContainer = document.getElementById("map-container");
  if (!mapContainer) return;

  try {
    // 加载高德地图API及插件
    await loadAMap(["AMap.Marker", "AMap.Polyline", "AMap.Driving"]);

    // 创建地图实例
    map = new AMap.Map("map-container", {
      zoom: 12,
      center: [122.12, 37.51],
      resizeEnable: true, // 允许地图自适应容器大小变化
      viewMode: "3D", // 使用3D视图
    });

    // 添加地图控件 - 使用插件管理器加载控件
    AMap.plugin(["AMap.ToolBar", "AMap.Scale",'AMap.Driving'], () => {
      // 添加工具条控件
      map.addControl(
        new AMap.ToolBar({
          position: "RB", // 控件位置，右下角
        })
      );
      // 添加比例尺控件
      map.addControl(new AMap.Scale());
      // 创建驾车路线规划实例 - 确保AMap.Driving已加载
      if (AMap.Driving) {
        driving = new AMap.Driving({
          map: map,
          panel: false, // 不使用路线规划面板
          // 使用数值0代替LEAST_TIME，表示最快路线
          policy: 0, // 最快路线，0表示最快捷模式
        });
      } else {
        console.error("AMap.Driving 插件未加载成功");
      }
      // 默认显示第一天路线
      showRoute(1);
    });



  } catch (error) {
    console.error("地图初始化失败:", error);
  }
};

/**
 * 显示路线
 * 根据选择的天数显示对应的景点和驾车路线
 * @param {number} day - 天数，1或2
 */
const showRoute = (day) => {
  if (!map) return;

  // 确保驾车路线规划实例已创建
  if (!driving) {
    try {
      // 创建驾车路线规划实例
      if (AMap.Driving) {
        driving = new AMap.Driving({
          map: map,
          panel: false, // 不使用路线规划面板
          policy: 0, // 最快路线，0表示最快捷模式
        });
      } else {
        console.error("AMap.Driving 插件未加载成功");
        return;
      }
    } catch (error) {
      console.error("创建驾车路线规划实例失败:", error);
      return;
    }
  }

  selectedDay.value = day;

  // 清除地图上的所有覆盖物
  map.clearMap();

  // 根据选择的天数获取景点数据
  const spots = day === 1 ? day1Spots.value : day2Spots.value;

  // 添加标记点和信息窗体
  spots.forEach((spot, index) => {
    const marker = new AMap.Marker({
      position: spot.coordinates,
      title: spot.name,
      label: {
        content: `${index + 1}. ${spot.name}`,
        direction: "top",
      },
      animation: "AMAP_ANIMATION_DROP", // 添加掉落动画效果
    });

    // 创建信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: `<div style="padding:10px;">
                  <h4 style="margin:0;color:#0288d1;">${spot.name}</h4>
                  <p style="margin:5px 0;">${spot.description.substring(
                    0,
                    50
                  )}...</p>
                  <p style="margin:5px 0;">建议游玩: ${spot.duration}</p>
                </div>`,
      offset: new AMap.Pixel(0, -30),
    });

    // 绑定鼠标点击事件
    marker.on("click", () => {
      infoWindow.open(map, marker.getPosition());
    });

    map.add(marker);
  });

  // 使用驾车路线规划
  if (spots.length > 1) {
    // 构建途经点数组
    const waypoints = spots.slice(1, -1).map((spot) => spot.coordinates);

    // 设置起点和终点
    driving.search(
      spots[0].coordinates, // 起点
      spots[spots.length - 1].coordinates, // 终点
      { waypoints: waypoints }, // 途经点
      (status, result) => {
        if (status === "complete") {
          console.log("驾车路线规划完成");
        } else {
          console.error("驾车路线规划失败:", result);
          // 如果驾车路线规划失败，回退到简单路线
          drawSimpleRoute(spots);
        }
      }
    );
  }
};

/**
 * 绘制简单路线
 * 当驾车路线规划失败时使用简单直线连接各景点
 * @param {Array} spots - 景点数组
 */
const drawSimpleRoute = (spots) => {
  if (!map || spots.length <= 1) return;

  const path = spots.map((spot) => spot.coordinates);

  const polyline = new AMap.Polyline({
    path: path,
    strokeColor: "#3388FF",
    strokeWeight: 6,
    strokeOpacity: 0.8,
    strokeStyle: "dashed",
    lineJoin: "round",
  });

  map.add(polyline);

  // 调整视图以包含所有点
  map.setFitView();
};

// 监听标签页变化
watch(activeTab, (newVal) => {
  if (newVal === "map") {
    // 延迟初始化地图，确保DOM已经渲染
    setTimeout(() => {
      initMap();
    }, 100);
  }
});

// 组件挂载时获取天气信息
onMounted(() => {
  getWeatherInfo();
});
</script>

<style scoped>
.travel-guide-container {
  padding: 20px 0;
}

/* 景点卡片样式 */
.spot-card {
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
}

.spot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.spot-image {
  width: 100%;
  max-width: 300px;
  height: 200px;
  object-fit: cover;
}

.spot-content {
  flex: 1;
  min-width: 300px;
}

/* 地图容器样式 */
.map-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 500px;
  width: 100%;
}

#map-container {
  height: 100%;
  width: 100%;
}

/* 天气卡片组样式 */
.v-slide-group {
  margin: 0 -8px;
}

.v-slide-group__container {
  padding-bottom: 8px;
}

/* 响应式布局调整 */
@media (max-width: 960px) {
  .text-h3 {
    font-size: 1.75rem !important;
  }

  .map-container {
    height: 400px;
  }
}

@media (max-width: 600px) {
  .spot-image,
  .spot-content {
    width: 100%;
    max-width: 100%;
  }

  .text-h3 {
    font-size: 1.5rem !important;
  }

  .text-h5 {
    font-size: 1.25rem !important;
  }

  .map-container {
    height: 350px;
  }

  .v-card-title {
    font-size: 1rem !important;
  }

  .v-card-text {
    padding: 12px !important;
  }

  .spot-card .d-flex {
    flex-direction: column;
  }

  .spot-image {
    height: 180px;
  }
}
</style>
