import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon"
import { Column, Id, Task } from "../types"
import {CSS} from "@dnd-kit/utilities"
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
    column:Column; 
    deleteColumn:(id:Id)=>void;
    updateColumn: (id:Id,title:string) => void;
    createTask:(columnId:Id)=>void
    tasks:Task[]
    deleteTask:(taskId:Id)=>void
    updateTask:(taskId:Id, content:string)=>void
}

function ColumnContainer(props:Props) {
    const {column, deleteColumn, updateColumn, createTask,tasks, deleteTask, updateTask} = props
    const [editMode, setEditMode] = useState(false)

    const {listeners,attributes,setNodeRef,transform,transition, isDragging} =useSortable({id:column.id, data:{type:"Column",column},disabled:editMode,})
    
    const tasksIds = useMemo(() => tasks.map((task)=>task.id), [tasks])

    const style ={
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-primaryColumnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-rose-500">

            </div>            
        )
    }
  
    return (
    <div
        ref={setNodeRef}
        style={style}
        className="bg-primaryColumnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
        {/* Column Title */}
        <div 
            {...attributes}
            {...listeners}
            onClick={()=>setEditMode(true)}
            className="flex justify-between items-center bg-primaryMainBackgroundColor text-base h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-primaryColumnBackgroundColor border-4">
            <div className="flex gap-2">
                <div className="flex justify-center items-center bg-primaryColumnBackgroundColor px-2 py-1 rounded-full">{tasks.length}</div>
                {!editMode && column.title}
                {editMode && <input 
                    className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                    autoFocus onBlur={()=>setEditMode(false)} onKeyDown={(e)=>{
                        if(e.key !== "Enter") return; 
                        setEditMode(false)
                    }} 
                    value={column.title}
                    onChange={(e)=>updateColumn(column.id,e.target.value)}
                    />}
            </div>
            <button onClick={()=>deleteColumn(column.id)} className="stroke-gray-500 hover:stroke-white hover:bg-primaryColumnBackgroundColor rounded px-1 py-2">
                <TrashIcon />
            </button>
        </div>

        {/* Column task Container */}
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
            <SortableContext items={tasksIds}>
            {
                tasks.map((task)=>(
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                ))
            }
            </SortableContext>
        </div>

        {/* Coumn Footer */}
        <button className="flex gap-2 items-center border-primaryColumnBackgroundColor border-2 
            rounded-md p-4 border-x-primaryColumnBackgroundColor hover:bg-primaryMainBackgroundColor 
            hover:text-rose-500 active:bg-black"
            onClick={()=> createTask(column.id)}
            
            >
            <PlusIcon />
            Add task
        </button>
    </div>
  )
}

export default ColumnContainer