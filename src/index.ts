// Copyright (c) 2018 Chris ter Beke
// am.js is open source under the terms of LGPLv3 or higher
import AMJS from './amjs/AMJS'

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
const amjs = new AMJS(canvas)

amjs.onReady.connect(({ success }) => {
	console.log('init success', success)
})

console.log('amjs', amjs)

amjs.init()
