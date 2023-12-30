import {useMemo, useState} from 'react'
import PlusIcon from '../icons/PlusIcon'
import { Column, Id, Task } from '../types'
import ColumnContainer from './ColumnContainer' 
import {DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors} from '@dnd-kit/core'
import {SortableContext, arrayMove} from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import TaskCard from './TaskCard'

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([])
    const columnsId = useMemo(() => columns.map((col)=>col.id), [columns])
    const [activeColumn, setActiveColumn] = useState<Column|null>(null)
    const [activeTask, setActiveTask] = useState<Task|null>(null)

    const [tasks, setTasks] = useState<Task[]>([])

    const sensors = useSensors(useSensor(PointerSensor,{activationConstraint:{distance:10}}))

  return (
    <div className='flex min-h-screen w-full m-auto items-center overflow-x-auto overflow-y-hidden px-[40px]'>
       <DndContext sensors={sensors} onDragStart={ondragstart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="m-auto flex gap-4">
            <div className="flex gap-4">
                <SortableContext items={columnsId}>
                    {
                        columns.map((column)=>(
                            <ColumnContainer key={column.id} column={column} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks={tasks.filter((task)=>task.columnId===column.id)} deleteTask={deleteTask} updateTask={updateTask} />
                        ))
                    }
                </SortableContext>
            </div>
            <button className='h-[60px] w-[350px] bg-primaryMainBackgroundColor min-w-[350px] rounded-lg cursor-pointer border-2 border-primaryColumnBackgroundColor p-2 ring-rose-500 hover:ring-2 flex gap-2'
            onClick={()=>createNewColumn()}
            >
                <PlusIcon /> Add Column
            </button>
        </div>
        {
            createPortal(
                <DragOverlay>
                    {
                        activeColumn && (<ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks={tasks.filter((task)=>task.columnId===activeColumn.id)} deleteTask={deleteTask} updateTask={updateTask} />)
                    }
                    {
                        activeTask && <TaskCard task={activeTask} updateTask={updateTask} deleteTask={deleteTask} />
                    }
                </DragOverlay>
                
                ,document.body)
        }
       </DndContext>
    </div>
  )

  function createNewColumn() {
    const columnToAdd: Column ={
         id: generateId(),
         title:`Coumn ${columns.length+1}`,

    }

    setColumns([...columns,columnToAdd])
  }

  function deleteColumn(id:Id) {
        const newColumns = columns.filter((column)=> column.id !== id)
        setColumns(newColumns)

        const newTasks = tasks.filter((t)=>t.columnId !==id)
        setTasks(newTasks)
    }

    function updateColumn(id:Id,title:string) {
        const newColumns = columns.map((col)=>{
            if(col.id !== id) return col
            return {...col,title }
        })
        setColumns(newColumns)
    }

    function ondragstart(event:DragStartEvent) {
        if (event.active.data.current?.type === "Column" ) {
            setActiveColumn(event.active.data.current.column)
            return;
        }
        if (event.active.data.current?.type === "Task" ) {
            setActiveTask(event.active.data.current.task)
            return;
        }
        
    }

    function onDragEnd(event:DragEndEvent) {
        setActiveTask(null)
        setActiveColumn(null)

        const {active, over} = event
        if (!over) return

        const activeColumnId = active.id
        const overColumnId = over.id

        if (activeColumnId===overColumnId) return;

        setColumns((columns)=>{
            const activeColumnIndex = columns.findIndex((col)=>col.id === activeColumnId)
            const overColumnIndex = columns.findIndex((col)=>col.id===overColumnId)
            return arrayMove(columns,activeColumnIndex,overColumnIndex)
        })
    }

    function createTask(columnId:Id) {
        const newTask:Task ={
            id: generateId(),
            columnId,
            content:`Task ${tasks.length + 1}`
        }
        setTasks([...tasks,newTask])
    }

    function deleteTask(taskId:Id) {
        const newTasks = tasks.filter((task)=>task.id !== taskId)
        setTasks(newTasks)
    }

    function updateTask(taskId:Id, content:string) {
        const newTasks = tasks.map((task)=>{
            if(task.id !== taskId) return task
            return {...task,content}
        })
        setTasks(newTasks)
    }
    
    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;
    
        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
    
        if (!isActiveATask) return;
    
        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
          setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);
    
            if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
              // Fix introduced after video recording
              tasks[activeIndex].columnId = tasks[overIndex].columnId;
              return arrayMove(tasks, activeIndex, overIndex - 1);
            }
    
            return arrayMove(tasks, activeIndex, overIndex);
          });
        }
    
        const isOverAColumn = over.data.current?.type === "Column";
    
        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
          setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
    
            tasks[activeIndex].columnId = overId;
            console.log("DROPPING TASK OVER COLUMN", { activeIndex });
            return arrayMove(tasks, activeIndex, activeIndex);
          });
        }
      }
    
}


function generateId() {
    return  Math.floor(Math.random()*10001)
}

export default KanbanBoard