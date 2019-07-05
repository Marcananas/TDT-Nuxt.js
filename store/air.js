export const state = () => ({
    airInfo: []
})
export const mutations = {
    // 保存历史信息到state
    setAirInfo(state, data) {
        // 感觉还能优化
        state.airInfo.push(data)
    }
}

export const actions = {

}