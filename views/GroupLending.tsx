import React, { useMemo, useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { Group, Customer } from './types';
import { NewGroupModal } from '../components/ActionModals';
import GroupIcon from '../components/icons/GroupIcon';
import StatusBadge from '../components/StatusBadge';

const GroupDetailView: React.FC<{ group: Group, onBack: () => void }> = ({ group, onBack }) => {
    const { customers, branches } = useAppContext();
    const leader = useMemo(() => customers.find(c => c.id === group.leaderId), [customers, group]);
    const members = useMemo(() => customers.filter(c => group.memberIds.includes(c.id)), [customers, group]);
    const branch = useMemo(() => branches.find(b => b.id === group.branchId), [branches, group]);

    const memberColumns: Column<Customer>[] = [
        { header: 'Name', accessor: 'name'},
        { header: 'PAN', accessor: 'pan' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];
    
    return (
        <div className="animate-fade-in">
             <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
                &larr; Back to Group List
            </button>
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div><p className="text-sm text-gray-500">Center/Village</p><p className="font-semibold">{group.center}</p></div>
                    <div><p className="text-sm text-gray-500">Branch</p><p className="font-semibold">{branch?.name}</p></div>
                    <div><p className="text-sm text-gray-500">Group Leader</p><p className="font-semibold">{leader?.name}</p></div>
                    <div><p className="text-sm text-gray-500">Members</p><p className="font-semibold">{members.length}</p></div>
                </div>
            </div>
            <DataTable columns={memberColumns} data={members} title="Group Members" />
        </div>
    )
}


const GroupLending: React.FC = () => {
    const { groups, customers, currentUser, branches } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    
    const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId), [groups, selectedGroupId]);

    const getLeaderName = (leaderId: string) => {
        return customers.find(c => c.id === leaderId)?.name || 'N/A';
    }

    const columns: Column<Group>[] = [
        { header: 'Group Name', accessor: 'name' },
        { header: 'Center / Village', accessor: 'center' },
        { header: 'Leader', accessor: 'leaderId', render: (row) => getLeaderName(row.leaderId) },
        { header: 'Members', accessor: 'memberIds', render: (row) => row.memberIds.length },
        { header: 'Branch', accessor: 'branchId', render: (row) => branches.find(b => b.id === row.branchId)?.name || 'N/A' },
        { header: 'Actions', accessor: 'id', render: (row) => <button onClick={() => setSelectedGroupId(row.id)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    if (selectedGroup) {
        return <GroupDetailView group={selectedGroup} onBack={() => setSelectedGroupId(null)} />;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <GroupIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Group Lending (JLG/SHG)</h2>
            </div>
            <DataTable
                columns={columns}
                data={groups}
                title="All Customer Groups"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Create New Group</button> : null}
            />
            <NewGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default GroupLending;