import GetMaterialListProps from "./getMaterialListProps"

class GetMaterialListDto {
    constructor(materialList: GetMaterialListProps[]) {
        this.materialList = materialList
    }
    materialList: GetMaterialListProps[]
}

export default GetMaterialListDto
