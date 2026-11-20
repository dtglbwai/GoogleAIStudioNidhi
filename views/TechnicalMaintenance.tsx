import React from 'react';
import DataTable, { Column } from '../components/DataTable';

const TechnicalMaintenance: React.FC = () => {
    const techTeamData = [
        { id: '1', name: 'Sanjay Gupta', role: 'Lead DevOps Engineer', focus: 'Server & Database Health' },
        { id: '2', name: 'Meera Desai', role: 'Senior Frontend Engineer', focus: 'UI/UX & Performance' },
        { id: '3', name: 'Rajesh Kumar', role: 'Backend Specialist', focus: 'API & Integrations' },
        { id: '4', name: 'Anita Rao', role: 'Security Analyst', focus: 'Platform Security & Audits' },
    ];

    const columns: Column<typeof techTeamData[0]>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Role', accessor: 'role' },
        { header: 'Area of Focus', accessor: 'focus' },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Technical Maintenance Team</h2>
            <DataTable
                columns={columns}
                data={techTeamData}
                title="Team Roster & Responsibilities"
            />
        </div>
    );
};

export default TechnicalMaintenance;