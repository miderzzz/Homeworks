import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const updateTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    else setTasks(data);
  }

const createTask = (title) => supabase.from('tasks').insert({ title });

const deleteTask = (id) => supabase.from('tasks').delete().eq('id', id);

const completeTask = (id, value) =>
  supabase.from('tasks').update({ completed: value }).eq('id', id);

  useEffect(() => {
    updateTasks();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("cambios-tareas").on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        if (payload.eventType === "INSERT") setTasks(t => [payload.new, ...t]);
        if (payload.eventType === "UPDATE") setTasks(t => t.map(task => task.id === payload.new.id ? payload.new : task));
        if (payload.eventType === "DELETE") setTasks(t => t.filter(task => task.id !== payload.old.id))}).subscribe((status) => console.log('Realtime:', status));

    return () => {
      supabase.removeChannel(channel);
    }}, [])

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return
        const { error } = await createTask(newTask);
        if (error) console.error(error);
        setNewTask('');
    }


const onComplete = async (t) => {
  const { error } = await completeTask(t.id, !t.completed);
  if (error) alert(error.message);
};

const onDelete = async (id) => {
  const { error } = await deleteTask(id);
  if (error) alert(error.message);
};

return (
  <div className="tasks">
    <h2>My tasks</h2>

    <form className="task-form" onSubmit={onSubmit}>
      <input value={newTask} onChange={(e) => setNewTask(e.target.value)}
             placeholder="Type your new task" />
      <button type="submit">Add</button>
    </form>

    <ul className="task-list">
      {tasks.map((t) => (
        <li key={t.id} className={`task-item ${t.completed ? 'done' : ''}`}>
          <input type="checkbox" checked={t.completed}
                 onChange={() => onComplete(t)} />
          <span>{t.title}</span>
          <button className="btn-delete" onClick={() => onDelete(t.id)}>🗑</button>
        </li>
      ))}
    </ul>
  </div>
);
}