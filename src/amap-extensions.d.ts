import '@amap/amap-jsapi-types';

declare namespace AMap {
  class CitySearch {
    constructor(options?: any);
    getLocalCity(callback: (status: string, result: any) => void): void;
    getCityByIp(ip: string, callback: (status: string, result: any) => void): void;
  }
}
