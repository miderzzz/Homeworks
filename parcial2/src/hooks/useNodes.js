import { useState, useEffect, useMemo } from "react"
import { db } from "../firebase/config"
import {
    collection, getDocs, addDoc, writeBatch, doc, serverTimestamp
} from "firebase/firestore";
import { buildTree } from "../class/TreeNode"


export function useNodes(user){
    const [nodes, setNodes] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError ] = useState(null);



    const tree = useMemo(() => buildTree(nodes),[nodes])

    const getAllNodes = async () => {
        setIsPending(true);
        setError(null);
        try{
            const snapshot = await getDocs(collection(db, "nodes"));
            setNodes(snapshot.docs.map((d) => ({
                id:d.id, ...d.data()
            })))
        }catch (err){
            setError("The tree could not be loaded")
        }finally{
            setIsPending(false)
        }


    }

    const addNode = async (name,type, parentId) => {
        if (!user) {
            setError("Must be logged in")
            return
        }
        if (parentId){
            const parent = nodes.find((n) => n.id === parentId);
            if (!parent || parent.type !== "folder"){
                setError("An archive can not has children")
                return
            }
        }

        try {
            await addDoc(collection(db, "nodes"), {
                name, type, parentId, createdBy: user.email, createdAt: serverTimestamp()
            })
            await getAllNodes();
            
        } catch (err) {
            setError(err.message)
        }
    }

    const getDecendantIds = (id) => {
        const children = nodes.filter((n) => n.parentId === id)
        return children.flatMap((c) => [c.id, ...getDecendantIds(c.id)])
    }

    const deleteNode = async (id) =>{
        try {
            const batch = writeBatch(db);
            [id, ...getDecendantIds(id)].forEach((nodeId) => {
                batch.delete(doc(db, "nodes", nodeId));
            });
            await batch.commit();
            await getAllNodes()
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        getAllNodes()
    }, [])

    return { tree,nodes, isPending, error, addNode, deleteNode}

}