import React, { useState } from 'react';
import type { DatabaseSettings, User } from '../types';
import { useBranding } from '../BrandingContext';
import LogoIcon from '../components/icons/LogoIcon';
import { NewUserModal } from '../components/ActionModals';

const mockUsersData: User[] = [
    { id: 'usr-1', name: 'Super Admin', email: 'admin@ifincaplen.com', role: 'Super Admin', lastLogin: '2023-06-15 10:30 AM' },
    { id: 'usr-2', name: 'Anil Kumar', email: 'anil.k@ifincaplen.com', role: 'Admin', lastLogin: '2023-06-15 09:45 AM' },
    { id: 'usr-3', name: 'Priya Sharma', email: 'priya.s@ifincaplen.com', role: 'Auditor', lastLogin: '2023-06-14 02:15 PM' },
];


const Settings: React.FC = () => {
  const [activeSetting, setActiveSetting] = useState('branding');
  const [dbSettings, setDbSettings] = useState<DatabaseSettings>({
      type: 'PostgreSQL',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      dbName: 'ifincaplen_db'
  });
  const [dbPassword, setDbPassword] = useState('password123');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [users, setUsers] = useState(mockUsersData);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState({ branding: false, database: false, auth: false });
  const [authSettings, setAuthSettings] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: false,
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const {
      projectName, setProjectName,
      logo, setLogo,
      primaryColor, setPrimaryColor,
  } = useBranding();

  const handleDbChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setDbSettings(prev => ({...prev, [name]: name === 'port' ? parseInt(value) : value }));
  };
  
  const testConnection = () => {
      setConnectionStatus('testing');
      setTimeout(() => {
          if(dbPassword !== 'fail') {
              setConnectionStatus('success');
          } else {
              setConnectionStatus('failed');
          }
          setTimeout(() => setConnectionStatus('idle'), 3000);
      }, 1500);
  }
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
              setLogo(event.target?.result as string);
          };
          reader.readAsDataURL(file);
      }
  };
  
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleBrandingSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, branding: true }));
    setTimeout(() => {
      setIsSaving(prev => ({ ...prev, branding: false }));
      showNotification('Branding settings saved successfully!');
    }, 1000);
  };

  const handleDatabaseSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, database: true }));
    setTimeout(() => {
      setIsSaving(prev => ({ ...prev, database: false }));
      showNotification('Database settings saved successfully!');
    }, 1000);
  };

  const handleAuthSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (authSettings.newPassword && authSettings.newPassword !== authSettings.confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    setIsSaving(prev => ({ ...prev, auth: true }));
    setTimeout(() => {
      setIsSaving(prev => ({ ...prev, auth: false }));
      showNotification('Authentication settings saved successfully!');
      setAuthSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }, 1000);
  };
  
  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setAuthSettings(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  }

  const handleAddUser = (newUser: Omit<User, 'id' | 'lastLogin'>) => {
    const user: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
      lastLogin: 'Never',
    };
    setUsers(prev => [user, ...prev]);
    setIsUserModalOpen(false);
  };

  const renderConnectionStatus = () => {
      switch(connectionStatus) {
          case 'testing':
              return <span className="text-sm text-yellow-600">Testing...</span>
          case 'success':
              return <span className="text-sm text-green-600">Connection successful!</span>
          case 'failed':
              return <span className="text-sm text-red-600">Connection failed. Check credentials.</span>
          default:
              return null;
      }
  }

  const renderContent = () => {
    const settingLabels: { [key: string]: string } = {
        payment: 'Payment Gateways',
        compliance: 'Compliance Rules',
        api: 'API Keys',
        authentication: 'Authentication & Security',
    };

    switch (activeSetting) {
      case 'branding':
        return (
          <div className="bg-white p-8 rounded-xl shadow-md animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Brand Customization</h3>
            <p className="text-gray-500 mb-6">Customize the look and feel of the application.</p>
            <form className="space-y-6" onSubmit={handleBrandingSave}>
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">SaaS Project Name</label>
                <input type="text" id="projectName" name="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700">Company Logo</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    {logo ? <img src={logo} alt="Current logo" className="h-full w-full object-contain" /> : <LogoIcon />}
                  </span>
                  <input type="file" id="logoUpload" name="logoUpload" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <label htmlFor="logoUpload" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                    Change
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">Primary Color</label>
                <input type="color" id="primaryColor" name="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="mt-1 block w-full h-10 px-1 py-1 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-primary focus:border-primary" />
              </div>
               <div className="pt-2">
                <button type="submit" disabled={isSaving.branding} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-wait">
                  {isSaving.branding ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        );
      case 'database':
          return (
             <div className="bg-white p-8 rounded-xl shadow-md animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Database Connection</h3>
                <p className="text-gray-500 mb-6">Manage the connection to your primary database.</p>
                <form className="space-y-6" onSubmit={handleDatabaseSave}>
                     <div>
                        <label htmlFor="dbType" className="block text-sm font-medium text-gray-700">Database Type</label>
                        <select id="dbType" name="type" value={dbSettings.type} onChange={handleDbChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option>PostgreSQL</option>
                            <option>MySQL</option>
                            <option>MongoDB</option>
                            <option>Firebase</option>
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="dbHost" className="block text-sm font-medium text-gray-700">Host</label>
                            <input type="text" id="dbHost" name="host" value={dbSettings.host} onChange={handleDbChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="dbPort" className="block text-sm font-medium text-gray-700">Port</label>
                            <input type="number" id="dbPort" name="port" value={dbSettings.port} onChange={handleDbChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="dbUsername" className="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" id="dbUsername" name="username" value={dbSettings.username} onChange={handleDbChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="dbPassword" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="dbPassword" name="password" value={dbPassword} onChange={e => setDbPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="dbName" className="block text-sm font-medium text-gray-700">Database Name</label>
                        <input type="text" id="dbName" name="dbName" value={dbSettings.dbName} onChange={handleDbChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                        <div>
                            <button type="button" onClick={testConnection} disabled={connectionStatus !== 'idle'} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                            </button>
                            <span className="ml-4">{renderConnectionStatus()}</span>
                        </div>
                        <button type="submit" disabled={isSaving.database} className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-wait">
                          {isSaving.database ? 'Saving...' : 'Save Connection'}
                        </button>
                    </div>
                </form>
            </div>
          );
      case 'users':
        return (
            <div className="bg-white p-8 rounded-xl shadow-md animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">User Management</h3>
                        <p className="text-gray-500">Manage users and their roles in the system.</p>
                    </div>
                    <button onClick={() => setIsUserModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New User</button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Last Login</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'Super Admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span>
                                </td>
                                <td className="px-6 py-4">{user.lastLogin}</td>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-primary hover:text-primary-dark">Edit</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      case 'authentication':
        return (
          <div className="bg-white p-8 rounded-xl shadow-md animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Authentication & Security</h3>
            <p className="text-gray-500 mb-6">Manage login credentials for the Super Admin account.</p>
            <form className="space-y-6" onSubmit={handleAuthSave}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" name="currentPassword" value={authSettings.currentPassword} onChange={handleAuthChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" name="newPassword" value={authSettings.newPassword} onChange={handleAuthChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter new password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" name="confirmPassword" value={authSettings.confirmPassword} onChange={handleAuthChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Confirm new password" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
                <label htmlFor="twoFactorToggle" className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="twoFactorEnabled" id="twoFactorToggle" className="sr-only peer" checked={authSettings.twoFactorEnabled} onChange={handleAuthChange} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
               <div className="pt-2">
                <button type="submit" disabled={isSaving.auth} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-wait">
                  {isSaving.auth ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return (
          <div className="bg-white p-8 rounded-xl shadow-md animate-fade-in text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{settingLabels[activeSetting] || 'Coming Soon'}</h3>
            <p className="text-gray-500">This feature is currently under development.</p>
          </div>
        );
    }
  };

  const SettingItem: React.FC<{ name: string; label: string }> = ({ name, label }) => (
    <button
      onClick={() => setActiveSetting(name)}
      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
        activeSetting === name ? 'bg-primary-light text-primary-dark' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Platform Settings</h2>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <aside className="md:w-1/4 lg:w-1/5 mb-6 md:mb-0">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Settings Menu</h3>
            <nav className="space-y-1">
              <SettingItem name="branding" label="Branding" />
              <SettingItem name="database" label="Database" />
              <SettingItem name="users" label="User Management" />
              <SettingItem name="authentication" label="Authentication" />
              <SettingItem name="payment" label="Payment Gateways" />
              <SettingItem name="compliance" label="Compliance" />
              <SettingItem name="api" label="API Keys" />
            </nav>
          </div>
        </aside>
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
      {notification && (
        <div className="fixed bottom-8 right-8 z-50 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg animate-fade-in">
          {notification}
        </div>
      )}
      <NewUserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default Settings;
