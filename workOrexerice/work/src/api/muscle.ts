import request from '@/utils/http'

//获取训练部位对应的肌肉列表
export function fetchGetMuscleList(params: Api.Muscle.SearchMucleByRegionId) {
    return request.get<Api.Muscle.MuscleList>({
        url: '/api/v1/muscle/list',
        params: params,
    })
}

//获取训练部位
export function fetchGetTrainingAreaList(params?: Api.Muscle.MuscleSearchParams) {
    return request.get<Api.Muscle.TrainingAreaListItem>({
        url: '/api/v1/muscle/region',
        params: params,
    })
}
