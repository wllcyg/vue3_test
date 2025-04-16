
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

export default class MyPromise {
    _status = PENDING;
    _result = undefined;
    _handlers = [];
    constructor(executor){
        const resolve = (data) => {
            this._changeStatus(FULFILLED, data);
        };
        const reject = (reason) => {
            this._changeStatus(REJECTED, reason);
        };
        try{
            executor(resolve, reject);
        }catch(err){
            reject(err);
        }
    }
    _changeStatus(status, result) {
        if (this._status === PENDING) {
            this._status = status;
            this._result = result;
        }
    }
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            // 存一下所有的状态
            this._handlers.push({
                onFulfilled,
                onRejected,
                resolve,
                reject
            });
            this._run();
        });
    }
    _run(){
        if (this._status === PENDING) return;
        while(this._handlers.length){
            const { onFulfilled, onRejected, resolve, reject } = this._handlers.shift();
            if (this._status === FULFILLED) {
                this._runFun(callback, resolve, reject)
            } else if (this._status === REJECTED) {
                this._runFun(callback, resolve, reject)
            }
        }
    }
    _runFun(callback,resolve,reject){
        this._runMicroTask(() => {
            if(typeof callback === 'function'){
                try{
                    const result = callback(this._result);
                    if(this._isPromiseLike(result)){
                        result.then(resolve,reject);
                    }else{
                        resolve(result);
                    }
                }catch(error){
                    reject(error);
                }
            } else {
                const settled = this._status === FULFILLED ? resolve : reject;
                settled(this._result);
            }
        })
    }
    _isPromiseLike(value){
        if (
            value !== null &&
            (typeof value === "object" || typeof value === "function")
        ) {
            return typeof value.then === "function";
        }
        return false;
    }
    _runMicroTask(callback){
        // 判断是否在node环境中
        if(typeof process !== 'undefined' && typeof process.nextTick === 'function'){
            process.nextTick(callback);
        }else if (typeof MutationObserver === 'function'){
            const observer = new MutationObserver(callback);
            const textNode = document.createTextNode('');
            observer.observe(textNode, { characterData: true });
            textNode.data = '1';
        }else {
            setTimeout(callback,0);
        }
    }
    static all(iterable) {
        return new MyPromise((resolve, reject) => {
            // 将可迭代对象转换为数组
            const promises = Array.from(iterable || []);

            if (promises.length === 0) {
                resolve([]);
                return;
            }

            const results = new Array(promises.length);
            let completedCount = 0;

            for (let i = 0; i < promises.length; i++) {
                // 处理非 Promise 值
                MyPromise.resolve(promises[i])
                    .then(value => {
                        results[i] = value;
                        completedCount++;

                        if (completedCount === promises.length) {
                            resolve(results);
                        }
                    }, error => {
                        reject(error);
                    });
            }
        });
    }
}
