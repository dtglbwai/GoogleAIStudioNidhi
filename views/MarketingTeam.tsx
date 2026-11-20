import React from 'react';
import DataTable, { Column } from '../components/DataTable';

const MarketingTeam: React.FC = () => {
    const marketingTeamData = [
        { id: '1', name: 'Anjali Mehta', role: 'Marketing Head', focus: 'Strategy & Branding' },
        { id: '2', name: 'Vikram Rao', role: 'Digital Marketing Manager', focus: 'SEO, SEM, Social Media' },
        { id: '3', name: 'Deepika Iyer', role: 'Content Specialist', focus: 'Blog, Email Campaigns' },
    ];

    const columns: Column<typeof marketingTeamData[0]>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Role', accessor: 'role' },
        { header: 'Area of Focus', accessor: 'focus' },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Marketing Team</h2>
            <DataTable
                columns={columns}
                data={marketingTeamData}
                title="Team Roster & Roles"
            />
        </div>
    );
};

export default MarketingTeam;