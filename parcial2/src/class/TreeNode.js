export class TreeNode{
    constructor({id, name, type, parentId = null, createdBy}){

        this.id = id;
        this.name = name;
        this.type = type;
        this.parentId = parentId;
        this.createdBy = createdBy;
        this.children = [];
    }

    isFolder(){
        return this.type === "folder"
    }

    addChild(node) {
        if(!this.isFolder()){
            throw new Error ("An archive cant contain archives, must be a folder")
        }
        this.children.push(node)
    }
}

export const buildTree = (docs) => {
    const map = new Map(docs.map((d)=> [d.id, new TreeNode(d)]));
    const roots = [];

    map.forEach((node) => {
        const parent = map.get(node.parentId);
        if (parent) {
            parent.addChild(node)
        }
        else{
            roots.push(node)
        }
    })

    return roots
}