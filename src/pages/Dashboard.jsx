import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import TaskModal from "../components/TaskModal";

export default function Dashboard({ user, onLogout }) {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [reminders, setReminders] = useState({
    dueSoon: [],
    overdue: [],
    count: 0,
  });
  const [teamFilter, setTeamFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [teamName, setTeamName] = useState("");
  const [memberUserId, setMemberUserId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteTeamId, setInviteTeamId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  async function reload() {
    const t = await api.getTeams();
    setTeams(t.teams || []);
    const ts = await api.getTasks({
      teamId: teamFilter || undefined,
      assigneeId: assigneeFilter || undefined,
    });
    setTasks(ts.tasks || []);
    const u = await api.getUsers();
    setUsers(u.users || []);
    const r = await api.getReminders();
    setReminders(r);
  }
  useEffect(() => {
    reload();
  }, [teamFilter, assigneeFilter]);

  async function createTeam() {
    if (!teamName) return;
    await api.createTeam(teamName);
    setTeamName("");
    reload();
  }
  async function addMember() {
    if (!selectedTeamId || !memberUserId) return;
    await api.addMember(Number(selectedTeamId), Number(memberUserId));
    setMemberUserId("");
    reload();
  }
  async function removeTeam(id) {
    await api.deleteTeam(id);
    reload();
  }
  async function sendInvite() {
    if (!inviteTeamId || !inviteEmail) return;
    const result = await api.inviteToTeam(Number(inviteTeamId), inviteEmail);
    alert(
      result.message || "Invite sent! Check backend console for email details."
    );
    setInviteEmail("");
    setInviteTeamId("");
  }

  async function createTask(data) {
    if (!teamFilter) return alert("Select a team filter to create task");
    await api.createTask({
      ...data,
      team_id: Number(teamFilter),
      created_by: user.id,
    });
    setModalOpen(false);
    reload();
  }
  async function saveTask(changes) {
    await api.updateTask(editing.id, changes);
    setEditing(null);
    setModalOpen(false);
    reload();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="font-semibold text-lg">Team Task Manager</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <span className="text-sm text-gray-600 truncate">
            {user.name} ({user.email})
          </span>
          <button
            className="text-red-600 hover:text-red-700 font-medium"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ✅ Reminders Banner (Always Visible) */}
      <div className="mx-2 sm:mx-4 mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⏰</div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 mb-2">
              Task Reminders
            </h3>

            {reminders.count === 0 && (
              <p className="text-sm text-gray-600">
                No upcoming due dates. You're all caught up! ✅
              </p>
            )}

            {reminders.overdue.length > 0 && (
              <div className="mb-2">
                <span className="text-sm font-medium text-red-700">
                  🔴 Overdue ({reminders.overdue.length}):
                </span>
                <ul className="text-sm text-red-800 ml-4 mt-1 space-y-1">
                  {reminders.overdue.slice(0, 3).map((task) => (
                    <li key={task.id}>
                      • {task.title} - Due: {task.due_date}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {reminders.dueSoon.length > 0 && (
              <div>
                <span className="text-sm font-medium text-orange-700">
                  🟡 Due Soon ({reminders.dueSoon.length}):
                </span>
                <ul className="text-sm text-orange-800 ml-4 mt-1 space-y-1">
                  {reminders.dueSoon.slice(0, 3).map((task) => (
                    <li key={task.id}>
                      • {task.title} - Due: {task.due_date}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ✅ TEAMS PANEL */}
        <section className="lg:col-span-1 bg-white p-4 rounded shadow space-y-4">
          <h2 className="font-semibold">Teams</h2>

          <div className="flex flex-col gap-2">
            <input
              className="border rounded px-2 py-1.5"
              placeholder="New team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded"
              onClick={createTeam}
            >
              Add Team
            </button>
          </div>

          {/* ✅ Fixed Add Member Layout */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Add member</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                className="border rounded px-2 py-1.5"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
              >
                <option value="">Select team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <select
                className="border rounded px-2 py-1.5"
                value={memberUserId}
                onChange={(e) => setMemberUserId(e.target.value)}
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <button
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded"
              onClick={addMember}
            >
              Add Member
            </button>
          </div>

          {/* INVITE */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Invite via email</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                className="border rounded px-2 py-1.5"
                value={inviteTeamId}
                onChange={(e) => setInviteTeamId(e.target.value)}
              >
                <option value="">Select team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <input
                className="border rounded px-2 py-1.5"
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <button
              className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded"
              onClick={sendInvite}
            >
              📧 Send Invite
            </button>
          </div>

          <ul className="divide-y">
            {teams.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-2">
                <button
                  className="text-left hover:text-blue-600 flex-1 truncate"
                  onClick={() => setTeamFilter(String(t.id))}
                >
                  {t.name}
                </button>
                <button
                  className="text-red-600 hover:text-red-700 text-sm"
                  onClick={() => removeTeam(t.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* TASKS PANEL */}
        <section className="lg:col-span-2 bg-white p-4 rounded shadow space-y-3">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-600 block mb-1">Team</label>
              <select
                className="w-full border rounded px-2 py-1.5"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="">All</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-600 block mb-1">
                Assignee
              </label>
              <select
                className="w-full border rounded px-2 py-1.5"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <option value="">All</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="sm:ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              + New Task
            </button>
          </div>

          <ul className="divide-y">
            {tasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium break-words">{task.title}</div>
                    <div className="text-sm text-gray-600 break-words">
                      {task.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      status: <b>{task.status}</b> • team: {task.team_id} •
                      assignee: {task.assigned_to ?? "-"} • due:{" "}
                      {task.due_date ?? "-"}
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-col lg:flex-row flex-shrink-0">
                    <button
                      className="text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => {
                        setEditing(task);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 font-medium"
                      onClick={() => api.deleteTask(task.id).then(reload)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={editing ? saveTask : createTask}
        initial={editing}
        users={users}
      />
    </div>
  );
}
