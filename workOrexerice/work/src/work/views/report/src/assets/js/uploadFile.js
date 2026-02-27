/*
 * @Descripttion: 文件上传
 * @Author: gaoyuanyuan
 * @Date: 2020-02-03 13:36:26
 * @LastEditors  : gaoyuanyuan
 * @LastEditTime : 2020-02-03 13:47:48
 */
import axios from 'axios' // 引入axio
import SparkMD5 from 'spark-md5'
import { apiUrl } from '@/assets/js/config.js'

export const fileUpLoad = function(file, type, uploadCallBack, errCallBack) {
    let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice
    let chunkSize = 2097152
    let chunks = Math.ceil(file.size / chunkSize)
    // read in chunks of 2MB
    let currentChunk = 0
    let spark = new SparkMD5.ArrayBuffer()
    let fileReader = new FileReader()
    let imgurl
    fileReader.onload = function(e) {
        spark.append(e.target.result) // append binary string
        currentChunk += 1
        if (currentChunk < chunks) {
            loadNext()
        } else {
            let configs = {
                headers: {
                    authorization: `bearer ${JSON.parse(window.localStorage.getItem('userTokens')).token || null}`
                }
            }
            axios
                .post(
                    apiUrl,
                    {
                        query: `
                    query {
                        getPolicyAndSign(
                            md5: "${spark.end()}",
                            fileName: "${file.name}",
                            type: ${type}
                        ){
                            code,
                            message,
                            data {
                                policy,
                                signature,
                                url
                            },
                        }
                    }
                `
                    },
                    configs
                )
                .then(result => {
                    if (result.data.data.getPolicyAndSign.code === 200) {
                        const formData = result.data.data.getPolicyAndSign.data
                        let params = new FormData() // 创建form对象
                        params.append('file', file, file.name)
                        params.append('policy', formData.policy)
                        params.append('authorization', formData.signature)
                        let config = {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        }
                        axios.post(`${formData.url}`, params, config).then(response => {
                            imgurl = 'https://src.visbodyfit.com'
                            window.setTimeout(() => {
                                uploadCallBack(`${imgurl}${response.data.url}`)
                            }, 500)
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    if (errCallBack) {
                        errCallBack(error)
                    }
                })
        }
    }
    fileReader.onerror = function() {
        console.warn('oops, something went wrong.')
    }

    async function loadNext() {
        const start = currentChunk * chunkSize
        const end = start + chunkSize >= file.size ? file.size : start + chunkSize

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }
    loadNext()
}
