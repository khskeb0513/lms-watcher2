class EClassService {
    async getEClasses() {
        const response = await fetch('/api/user/getList')
        return response.json()
    }
}

export default EClassService
