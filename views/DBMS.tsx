import React from 'react';
import { useAppContext } from '../AppContext';
import DatabaseIcon from '../components/icons/DatabaseIcon';
import LoanIcon from '../components/icons/LoanIcon';
import AccountingIcon from '../components/icons/AccountingIcon';
import ShieldIcon from '../components/icons/ShieldIcon';
import AnalyticsIcon from '../components/icons/AnalyticsIcon';
import SuperAdminIcon from '../components/icons/SuperAdminIcon';
import GavelIcon from '../components/icons/GavelIcon';
import { AppModule } from './types';

const ModuleStatusCard: React.FC<{ moduleName: string; icon: React.ReactNode; isConnected: boolean }> = ({ moduleName, icon, isConnected }) => (
    <div className={`bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 ${isConnected ? 'border-green-500' : 'border-gray-300'}`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {icon}
                </div>
                <div className="ml-3">
                    <p className="text-md font-semibold text-gray-800 capitalize">{moduleName}</p>
                </div>
            </div>
            {isConnected ? (
                <span className="text-xs font-bold text-green-600">CONNECTED</span>
            ) : (
                <span className="text-xs font-bold text-gray-500">DISABLED</span>
            )}
        </div>
    </div>
);

const DBMS: React.FC = () => {
    const { databaseSettings, moduleConfig } = useAppContext();

    const moduleIcons: Record<AppModule, React.ReactNode> = {
        lms: <LoanIcon />,
        accounting: <AccountingIcon />,
        risk: <ShieldIcon />,
        analytics: <AnalyticsIcon />,
        system: <SuperAdminIcon />,
        intelligence: <AnalyticsIcon />,
        legal: <GavelIcon />,
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <DatabaseIcon />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
                    <p className="text-sm text-gray-500">View and manage the platform's database connection.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Current Database Configuration
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            These settings are defined in the Platform Control center by a Super Admin.
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                 <dt className="text-sm font-medium text-gray-500">Database Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold text-primary">{databaseSettings.type}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                 <dt className="text-sm font-medium text-gray-500">Host</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{databaseSettings.host}</dd>
                            </div>
                             <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                 <dt className="text-sm font-medium text-gray-500">Port</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{databaseSettings.port}</dd>
                            </div>
                             <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                 <dt className="text-sm font-medium text-gray-500">Database Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{databaseSettings.dbName}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                 <dt className="text-sm font-medium text-gray-500">Username</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{databaseSettings.username}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Connected Modules
                    </h3>
                    <div className="space-y-3">
                        {(Object.keys(moduleIcons) as AppModule[]).map((module) => (
                            <ModuleStatusCard 
                                key={module}
                                moduleName={module}
                                icon={moduleIcons[module]}
                                isConnected={moduleConfig[module]}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.636-1.1 2.27-1.1 2.906 0l4.208 7.363c.636 1.1-.182 2.538-1.453 2.538H5.495c-1.271 0-2.09-1.438-1.453-2.538l4.215-7.363zM10 12a1 1 0 100-2 1 1 0 000 2zm0 3a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Warning: Changes to the database configuration can cause service disruption and should only be performed by authorized personnel during a maintenance window.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DBMS;