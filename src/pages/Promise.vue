<template>
    <div>
        <h3>Promise Example</h3>

    </div>
</template>
<script lang="ts" setup>
import MyPromise from './code/promise';
const promise = new MyPromise((reslove, reject) => {
    setTimeout(() => {
        reject('123');
    }, 2000);
});

promise.then(null,err => {
    console.log(err);
    return 456;
}).then(data => {
    console.log('ok resolved123',data);
});
</script>
