/* eslint-disable */

const formdata = {
    actionMedia: [] as Array<{url: string, storage: string, type: 'video' | 'image'}>,
    muscleGroup: [] as number[]
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
    if (urlLower.includes('mp4') || urlLower.includes('video')) {
        return 'video'
    }
    
    return 'image'
}

const getType = (file: File): 'video' | 'image' => {
    if (file.type.startsWith('image/')) {
        return 'image'
    }

    if (file.type.startsWith('video/')) {
        return 'video'
    }

    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.jpg')) {
        return 'image'
    } else if (fileName.endsWith('.mp4')) {
        return 'video'
    }

    return 'image'
}

const partMuscleMap = ref<Map<number, number[]>>(new Map<number, number[]>())
const previousPart = ref<number[]>([])
const handlePartChange = (newPart: number[]) => {
    const removeParts = previousPart.value.filter((id: number) => !newPart.includes(id))

    if (removeParts.length > 0) {
        const removePartsIds = new Set<number>()
        for (const partId of removeParts) {
            const muscleIds = partMuscleMap.value.get(partId)
            if (muscleIds) {
                muscleIds.forEach(id => removePartsIds.add(id))
            }
        }

        formdata.muscleGroup = formdata.muscleGroup.filter(id => !removePartsIds.has(id))
    }

}