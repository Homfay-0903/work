/* eslint-disable */

const formdata = {
    actionMedia: [] as Array<{url: string, storage: string, type: 'video' | 'image'}>
}

const actionMediaUrls = row.actionMedia || []
const actionMediaStorageUrls = row._actionMedia || []

if(Array.isArray(actionMediaUrls) && actionMediaUrls.length > 0) {
    formdata.actionMedia = actionMediaUrls.map((url: string, index: number) => ({
        url: url,
        storage: actionMediaStorageUrls[index],
        type: getTypeByUrl(url)
    }))
} else {
    formdata.actionMedia = []
}

const getTypeByUrl = (url: string): 'video' | 'image' => {
    if (!url) return 'image'

    const urlLower = url.toLowerCase()
    if(urlLower.includes('mp4') || urlLower.includes('video')) {
        return 'video'
    }
    
    return 'image'
}