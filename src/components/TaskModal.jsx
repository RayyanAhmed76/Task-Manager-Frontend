import React, { useEffect, useState } from 'react'

export default function TaskModal({ open, onClose, onSave, initial, users = [] }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [assigned_to, setAssignedTo] = useState(initial?.assigned_to || '')
  const [due_date, setDueDate] = useState(initial?.due_date || '')

  useEffect(()=>{
    setTitle(initial?.title || '')
    setDescription(initial?.description || '')
    setAssignedTo(initial?.assigned_to || '')
    setDueDate(initial?.due_date || '')
  }, [initial])

  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800">{initial ? 'Update Task' : 'Create New Task'}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Enter task title" 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y" 
              placeholder="Enter task description" 
              value={description} 
              onChange={e=>setDescription(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee (Optional)</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={assigned_to} 
              onChange={e=>setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map(u=> <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              type="date" 
              value={due_date} 
              onChange={e=>setDueDate(e.target.value)} 
            />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-2">
          <button 
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors" 
            onClick={()=>onSave({ title, description, assigned_to: assigned_to? Number(assigned_to): null, due_date })}
          >
            {initial ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
