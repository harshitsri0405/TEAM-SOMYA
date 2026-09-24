export default function UsersRoles() {
  const users = [
    { name: 'PWD Control Room', role: 'Super Admin' },
    { name: 'Zone 4 Team', role: 'Field Operator' },
    { name: 'Traffic Analyst', role: 'Viewer' }
  ];
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Users &amp; Roles</h2>
      <div className="panel divide-y divide-base-border">
        {users.map((u) => (
          <div key={u.name} className="px-4 py-3 flex justify-between text-sm">
            <span className="text-slate-700">{u.name}</span>
            <span className="text-slate-400">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}