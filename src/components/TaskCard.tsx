import { useRef, useState } from "react"
import TrashIcon from "../icons/TrashIcon"
import { Id, Task } from "../types"
import { useSortable } from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities'

interface Props {
    task:Task
    deleteTask:(taskId:Id)=>void
    updateTask:(taskId:Id,content:string)=>void
}

function TaskCard(props:Props) {
    const {task, deleteTask, updateTask} = props
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const {listeners,attributes,setNodeRef,transform,transition, isDragging} = useSortable({id:task.id, data:{type:"Task",task},disabled:editMode,})

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleInputFocus = () => {

      if (textAreaRef.current) {
          alert(2)
        const length = textAreaRef.current.value.length;
        textAreaRef.current.setSelectionRange(length, length);
      }
    };

    const style ={
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const toggleEditMode = ()=>{
        setEditMode((prev)=>!prev)
        setMouseIsOver(false)
    }

    if (isDragging) {
        return (   
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative"
            />
        );
    }

    if (editMode) {
        return (
            <div  
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="relative bg-primaryMainBackgroundColor p-2.5 h-[100px] min-h[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset ring-rose-500 cursor-grab"
            >
                <textarea
                    ref={textAreaRef}
                    onFocus={handleInputFocus}
                    className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
                    value={task.content}
                    autoFocus
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) toggleEditMode();
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                ></textarea>
            </div>
        )
    }

  return (
    <div  
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        onMouseEnter={()=>setMouseIsOver(true)}
        onMouseLeave={()=>setMouseIsOver(false)}
        className="relative bg-primaryMainBackgroundColor p-2.5 h-[100px] min-h[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset ring-rose-500 cursor-grab task"
    >
        <p
            className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
        >
            {task.content}
        </p>
        
        {mouseIsOver && 
            <button 
                onClick={()=>deleteTask(task.id)}
                className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-primaryColumnBackgroundColor p-2 rounded opacity-60 hover:opacity-100">
                <TrashIcon />
            </button>      
        }
    </div>
  )
}

export default TaskCard