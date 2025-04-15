// 定义 Promise 的状态常量
const PENDING: "pending" = "pending";
const FULFILLED: "fulfilled" = "fulfilled";
const REJECTED: "rejected" = "rejected";

// Promise 的状态类型
type PromiseStatus = typeof PENDING | typeof FULFILLED | typeof REJECTED;

// executor 函数的类型
type Executor<T> = (
    reslove: (value: T) => void,
    reject: (reason: any) => void,
) => void;

export default class MyPromise<T> {
    #status: PromiseStatus = PENDING;
    #result: T | any = undefined;
    #handlers: {
        onFulfilled: Function | undefined;
        onRejected: Function | undefined;
        reslove: Function;
        reject: Function;
    }[] = [];
    constructor(executor: Executor<T>) {
        const reslove = (data: T): void => {
            this.#changeStatus(FULFILLED, data);
        };

        const reject = (reason: any): void => {
            this.#changeStatus(REJECTED, reason);
        };

        try {
            executor(reslove, reject); // executor 函数执行,将reslove和reject函数作为参数传入executor函数中，以便在executor函数中调用reslove和reject函数
        } catch (error) {
            reject(error);
        }
    }

    #isPromiseLike(value: any): boolean {
        if (
            value !== null &&
            (typeof value === "object" || typeof value === "function")
        ) {
            return typeof value.then === "function";
        }
        return false;
    }
    #runMicroTask(
        callback: (
            mutations?: MutationRecord[],
            observer?: MutationObserver,
        ) => void,
    ) {
        if (
            typeof process === "object" &&
            typeof process.nextTick === "function"
        ) {
            process.nextTick(callback);
        } else if (typeof MutationObserver === "function") {
            const observer = new MutationObserver(callback);
            const textNode = document.createTextNode("1");
            observer.observe(textNode, { characterData: true });
            textNode.data = "2";
        } else {
            setTimeout(callback, 0);
        }
    }
    #changeStatus(status: PromiseStatus, result: T | any): void {
        if (this.#status !== PENDING) return;
        this.#status = status;
        this.#result = result;
        this.#run();
    }
    #runFun(
        callback: Function | undefined,
        reslove: Function,
        reject: Function,
    ) {
        this.#runMicroTask(() => {
            if (typeof callback === "function") {
                try {
                    const data = callback(this.#result);
                    if (this.#isPromiseLike(data)) {
                        data.then(reslove, reject); // 继续传递成功失败回调
                    } else {
                        reslove(data);
                    }
                } catch (error) {
                    reject(error);
                }
            } else {
                const settled = this.#status === FULFILLED ? reslove : reject;
                settled(this.#result);
            }
        });
    }
    #run() {
        if (this.#status === PENDING) return;
        while (this.#handlers.length > 0) {
            const { onFulfilled, onRejected, reslove, reject } =
                this.#handlers.shift()!;
            if (this.#status === FULFILLED) {
                this.#runFun(onFulfilled, reslove, reject);
            } else if (this.#status === REJECTED) {
                this.#runFun(onRejected, reslove, reject);
            }
        }
    }
    then<R>(
        onFulfilled?: ((value: T) => R | PromiseLike<R>) | undefined,
        onRejected?: ((reason: any) => R | PromiseLike<R>) | undefined,
    ): MyPromise<R> {
        return new MyPromise<R>((reslove, reject) => {
            this.#handlers.push({
                onFulfilled,
                onRejected,
                reslove,
                reject,
            });
            this.#run();
        });
    }
    catch(onRejected?: ((reason: any) => any | PromiseLike<any>) | undefined) {
        return this.then(undefined, onRejected);
    }
    finally(onFinally?: (() => void) | undefined) {
        return this.then(
            (data) => {
                onFinally?.();
                return data;
            },
            (err) => {
                onFinally?.();
                throw err;
            },
        );
    }
    static resolve(value: any): MyPromise<any> {
        if (value instanceof MyPromise) return value;
        let _reslove, _reject;
        const p = new MyPromise((reslove, reject) => {
            _reslove = reslove;
            _reject = reject;
        });
        if (p.#isPromiseLike(value)){
            value.then(_reslove, _reject);
        } else {
        _reslove!(value);
    }
        return p;
    }
    static reject(reason: any): MyPromise<any> {
        return new MyPromise((_, reject) => {
            reject(reason);
        });
    }
}
