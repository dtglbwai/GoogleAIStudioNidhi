import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { 
  WorkspaceProject, 
  WorkspaceTask, 
  WorkspaceCustomer, 
  WorkspaceSupplier, 
  WorkspaceDocument, 
  WorkspaceStage, 
  WorkspacePriority, 
  WorkspaceDocCategory 
} from './types';
import WorkspaceIcon from '../components/icons/WorkspaceIcon';

// Tab types
type WorkspaceTab = 
  | 'overview' 
  | 'projects' 
  | 'submissionChecklist' 
  | 'dms' 
  | 'partners' 
  | 'communication' 
  | 'portalAccess';

const OmniWorkspace: React.FC = () => {
  const {
    workspaceProjects,
    workspaceTasks,
    workspaceCustomers,
    workspaceSuppliers,
    workspaceDocuments,
    workspaceChannelMessages,
    workspaceChecklists,
    workspaceAuditLogs,
    handleCreateWorkspaceProject,
    handleUpdateProjectStage,
    handleCreateWorkspaceTask,
    handleToggleWorkspaceChecklistItem,
    handleUpdateTaskStatus,
    handleCreateWorkspaceDocument,
    handleSignWorkspaceDocument,
    handleRejectWorkspaceDocument,
    handleSendWorkspaceMessage,
    handleVerifyWorkspaceChecklist,
    handleAddWorkspaceCustomer,
    handleAddWorkspaceSupplier,
    currentUser
  } = useAppContext();

  // Navigation State
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [projectFilterCategory, setProjectFilterCategory] = useState<string>('ALL');
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
  const [projectViewMode, setProjectViewMode] = useState<'kanban' | 'timeline' | 'table'>('kanban');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(workspaceProjects[0]?.id || '');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-aerospace');
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [partnerTypeToggle, setPartnerTypeToggle] = useState<'customers' | 'suppliers'>('customers');

  // Modals state
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState<boolean>(false);
  const [showSignDocModal, setShowSignDocModal] = useState<boolean>(false);
  const [showRejectDocModal, setShowRejectDocModal] = useState<boolean>(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<WorkspaceTask | null>(null);

  // Portal Login / Activation Simulation State (replica of oasis/login.jsp)
  const [portalDomain, setPortalDomain] = useState<string>('TENANT-NORTH-AMERICA');
  const [portalUserId, setPortalUserId] = useState<string>('sarah.jenkins@enterprise-ws.com');
  const [portalPassword, setPortalPassword] = useState<string>('••••••••••••');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [portalAuthStatus, setPortalAuthStatus] = useState<'AUTHENTICATED' | 'LOGGED_OUT' | 'AWAITING_2FA'>('AUTHENTICATED');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [showActivationModal, setShowActivationModal] = useState<boolean>(false);
  const [activationCode, setActivationCode] = useState<string>('');
  const [activationEmail, setActivationEmail] = useState<string>('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [resetSuccessBanner, setResetSuccessBanner] = useState<string | null>(null);

  // Form states for creation
  const [newProjName, setNewProjName] = useState<string>('');
  const [newProjCode, setNewProjCode] = useState<string>('');
  const [newProjCategory, setNewProjCategory] = useState<string>('Qualifying Federal & Aerospace');
  const [newProjCustomer, setNewProjCustomer] = useState<string>(workspaceCustomers[0]?.id || '');
  const [newProjSupplier, setNewProjSupplier] = useState<string>(workspaceSuppliers[0]?.id || '');
  const [newProjBudget, setNewProjBudget] = useState<number>(250000);
  const [newProjDueDate, setNewProjDueDate] = useState<string>('2026-12-31');
  const [newProjDesc, setNewProjDesc] = useState<string>('');

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('Sarah Jenkins');
  const [newTaskPriority, setNewTaskPriority] = useState<WorkspacePriority>('high');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('2026-10-30');
  const [newTaskHours, setNewTaskHours] = useState<number>(20);
  const [newTaskWorkflowRule, setNewTaskWorkflowRule] = useState<string>('Mandatory QA sign-off prior to milestone closure');

  const [newDocTitle, setNewDocTitle] = useState<string>('');
  const [newDocCategory, setNewDocCategory] = useState<WorkspaceDocCategory>('qa_certificate');
  const [newDocVersion, setNewDocVersion] = useState<string>('v1.0');
  const [newDocType, setNewDocType] = useState<'pdf' | 'png' | 'docx' | 'dwg'>('pdf');
  const [newDocTags, setNewDocTags] = useState<string>('Quality, Compliance, Verification');

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return workspaceProjects.filter(p => {
      const matchCat = projectFilterCategory === 'ALL' || p.category === projectFilterCategory;
      const matchSearch = p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                          p.code.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                          p.customerName.toLowerCase().includes(projectSearchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [workspaceProjects, projectFilterCategory, projectSearchQuery]);

  // Selected Project
  const activeProject = useMemo(() => {
    return workspaceProjects.find(p => p.id === selectedProjectId) || workspaceProjects[0];
  }, [workspaceProjects, selectedProjectId]);

  // Document for inspection
  const inspectingDoc = useMemo(() => {
    return workspaceDocuments.find(d => d.id === selectedDocId) || null;
  }, [workspaceDocuments, selectedDocId]);

  // Channel messages
  const activeChannelMessages = useMemo(() => {
    return workspaceChannelMessages.filter(m => m.channelId === activeChannelId);
  }, [workspaceChannelMessages, activeChannelId]);

  // KPIs
  const totalContractValueAll = useMemo(() => {
    return workspaceCustomers.reduce((acc, c) => acc + c.totalContractValue, 0);
  }, [workspaceCustomers]);

  const pendingApprovalsCount = useMemo(() => {
    return workspaceDocuments.filter(d => d.status === 'pending_approval').length;
  }, [workspaceDocuments]);

  // Handlers
  const handlePortalLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalUserId.trim()) return;
    setPortalAuthStatus('AWAITING_2FA');
  };

  const handleVerify2fa = (e: React.FormEvent) => {
    e.preventDefault();
    setPortalAuthStatus('AUTHENTICATED');
    setTwoFactorCode('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    handleSendWorkspaceMessage(
      activeChannelId, 
      newMessageText, 
      currentUser || 'Operations Lead', 
      'Enterprise Workspace Manager'
    );
    setNewMessageText('');
  };

  const submitNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    const cust = workspaceCustomers.find(c => c.id === newProjCustomer);
    const supp = workspaceSuppliers.find(s => s.id === newProjSupplier);

    handleCreateWorkspaceProject({
      code: newProjCode || `PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newProjName,
      category: newProjCategory,
      customerId: newProjCustomer,
      customerName: cust?.name || 'Enterprise Customer',
      supplierId: newProjSupplier,
      supplierName: supp?.name || 'Preferred Supplier',
      stage: 'planning',
      priority: 'high',
      progressPct: 10,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: newProjDueDate,
      ownerName: currentUser || 'Sarah Jenkins (PM)',
      budget: Number(newProjBudget),
      currency: 'USD',
      tags: ['Workspace', 'Active Deliverable'],
      description: newProjDesc || 'Customer & Supplier collaborative workspace project'
    });

    setShowNewProjectModal(false);
    setNewProjName('');
    setNewProjCode('');
    setNewProjDesc('');
  };

  const submitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeProject) return;
    handleCreateWorkspaceTask({
      projectId: activeProject.id,
      projectCode: activeProject.code,
      title: newTaskTitle,
      assignee: newTaskAssignee,
      status: 'todo',
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      estimatedHours: Number(newTaskHours),
      actualHours: 0,
      checklistItems: [
        { id: `chk-${Date.now()}-1`, text: 'Initial specification alignment', done: false },
        { id: `chk-${Date.now()}-2`, text: 'Documentation and file attachment upload', done: false },
        { id: `chk-${Date.now()}-3`, text: 'Sign-off and stakeholder verification', done: false }
      ],
      workflowRule: newTaskWorkflowRule
    });
    setShowNewTaskModal(false);
    setNewTaskTitle('');
  };

  const submitUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    handleCreateWorkspaceDocument({
      title: newDocTitle,
      category: newDocCategory,
      version: newDocVersion,
      fileType: newDocType,
      fileSize: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      uploadedBy: `${currentUser || 'Operations Lead'} (${portalDomain})`,
      status: 'pending_approval',
      customerOrSupplierName: activeProject?.customerName,
      associatedProjectId: activeProject?.id,
      tags: newDocTags.split(',').map(t => t.trim())
    });
    setShowUploadDocModal(false);
    setNewDocTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / System Title Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-lg shadow-md">
              <WorkspaceIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight">OmniWorkspace Enterprise</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Unified Collaboration Standards
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SSL 256-Bit AES Verified
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Multi-Tenant Customer & Supplier Collaboration System • Project Workflows • Proposal Checklist Engine • Digital FileSmart DMS
              </p>
            </div>
          </div>

          {/* Tenant Selector & Auth Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Domain:</span>
              <select 
                value={portalDomain} 
                onChange={(e) => setPortalDomain(e.target.value)}
                className="bg-transparent text-xs font-semibold text-indigo-300 focus:outline-none cursor-pointer"
              >
                <option value="TENANT-NORTH-AMERICA" className="bg-slate-800 text-white">TENANT-NORTH-AMERICA</option>
                <option value="TENANT-EMEA-SUPPLY" className="bg-slate-800 text-white">TENANT-EMEA-SUPPLY</option>
                <option value="TENANT-GLOBAL-PARTNERS" className="bg-slate-800 text-white">TENANT-GLOBAL-PARTNERS</option>
                <option value="DEMO-ENTERPRISE-WS" className="bg-slate-800 text-white">DEMO-ENTERPRISE-WS</option>
              </select>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">{portalUserId}</span>
              <button 
                onClick={() => setPortalAuthStatus(portalAuthStatus === 'AUTHENTICATED' ? 'LOGGED_OUT' : 'AUTHENTICATED')}
                className="ml-2 text-indigo-400 hover:text-indigo-200 underline text-xs cursor-pointer font-medium"
              >
                {portalAuthStatus === 'AUTHENTICATED' ? 'Switch Portal / Relogin' : 'Enter Portal'}
              </button>
            </div>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex items-center space-x-1 mt-6 border-t border-slate-800 pt-3 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Overview & Control Center</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'projects' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Project & Task Pipelines</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-xs font-bold text-slate-200">
              {workspaceTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('submissionChecklist')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'submissionChecklist' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Submission Checklist (OASIS+)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              Gates
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dms')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'dms' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Digital DMS & FileSmart</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'partners' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Customers & Suppliers</span>
          </button>

          <button
            onClick={() => setActiveTab('communication')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'communication' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Channels & Collaboration</span>
          </button>

          <button
            onClick={() => setActiveTab('portalAccess')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === 'portalAccess' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Portal Login (login.jsp) & MFA</span>
          </button>
        </div>
      </div>

      {/* Reset success notification */}
      {resetSuccessBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center justify-between text-sm shadow-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{resetSuccessBanner}</span>
          </div>
          <button onClick={() => setResetSuccessBanner(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">×</button>
        </div>
      )}

      {/* TAB 1: OVERVIEW & CONTROL CENTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspace Health</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">OPTIMAL</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-gray-900">98.4%</span>
                <span className="text-xs text-emerald-600 font-semibold">+1.2% this sprint</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '98.4%' }}></div>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">Zero critical SLA bottlenecks</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Projects</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">4 IN FLIGHT</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-gray-900">{workspaceProjects.length}</span>
                <span className="text-xs text-blue-600 font-semibold">18 Sub-milestones</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">Avg milestone velocity: 94.2%</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DMS Approvals Queue</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                  {pendingApprovalsCount} ACTION REQUIRED
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-gray-900">{pendingApprovalsCount}</span>
                <span className="text-xs text-amber-600 font-semibold">E-Signature Needed</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">Includes AS9102 Rev B FAI Dossier</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contracted Portfolio</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">TOTAL VALUE</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-gray-900">${(totalContractValueAll / 1000000).toFixed(2)}M</span>
                <span className="text-xs text-indigo-600 font-semibold">4 Clients • 4 Vendors</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">96.8% On-time delivery SLA index</span>
            </div>
          </div>

          {/* Action Header & Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Workspace Fast-Action Dispatcher</h2>
                <p className="text-sm text-gray-500">Initiate collaborative workflows across customers, suppliers, and internal engineering teams.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>+ New Project</span>
                </button>
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  + Add Task / Gate
                </button>
                <button
                  onClick={() => setShowUploadDocModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  + Upload DMS File
                </button>
              </div>
            </div>

            {/* Active Projects Status Bar */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Active Workspace Pipeline Matrix</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {workspaceProjects.map((proj) => (
                  <div 
                    key={proj.id} 
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setActiveTab('projects');
                    }}
                    className="p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-gray-50/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {proj.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        proj.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                        proj.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {proj.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{proj.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Client: <span className="font-medium text-gray-700">{proj.customerName}</span></p>
                    {proj.supplierName && (
                      <p className="text-xs text-gray-500">Supplier: <span className="font-medium text-gray-700">{proj.supplierName}</span></p>
                    )}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Stage: <strong className="text-gray-800 capitalize">{proj.stage.replace('_', ' ')}</strong></span>
                      <span className="font-bold text-indigo-600">{proj.progressPct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${proj.progressPct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Audit Log Stream */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <h3 className="text-base font-bold text-gray-900">Workspace Activity & Cryptographic Audit Stream</h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">Immutable Log Stream</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Audit Description</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workspaceAuditLogs.slice(0, 6).map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-gray-500">{log.timestamp}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{log.actor}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-gray-600">{log.targetType}</td>
                      <td className="py-3 px-4 text-gray-700 max-w-md truncate">{log.description}</td>
                      <td className="py-3 px-4 text-xs font-mono text-gray-400">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS & TASK PIPELINES */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search projects, tasks, or codes..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />

              <select
                value={projectFilterCategory}
                onChange={(e) => setProjectFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Qualifying Federal & Aerospace">Qualifying Federal & Aerospace</option>
                <option value="Medical Device Manufacturing">Medical Device Manufacturing</option>
                <option value="Enterprise Fintech & Treasury">Enterprise Fintech & Treasury</option>
                <option value="Clean Energy & Automotive">Clean Energy & Automotive</option>
              </select>

              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3 py-2 border border-indigo-300 bg-indigo-50/50 rounded-lg text-sm font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {workspaceProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.code}: {p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 rounded-lg p-1 flex items-center space-x-1 text-xs font-semibold">
                <button
                  onClick={() => setProjectViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    projectViewMode === 'kanban' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Kanban Board
                </button>
                <button
                  onClick={() => setProjectViewMode('timeline')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    projectViewMode === 'timeline' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Gantt / Timeline
                </button>
                <button
                  onClick={() => setProjectViewMode('table')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    projectViewMode === 'table' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Task Table
                </button>
              </div>

              <button
                onClick={() => setShowNewTaskModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* Active Project Highlight Card */}
          {activeProject && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white shadow-md">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="font-mono text-sm px-2.5 py-0.5 rounded bg-indigo-500/30 border border-indigo-400 text-indigo-200 font-bold">
                      {activeProject.code}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      {activeProject.category}
                    </span>
                    {activeProject.qualifyingProjectCode && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                        {activeProject.qualifyingProjectCode}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{activeProject.name}</h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl">{activeProject.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div>
                    <span className="text-slate-400 block">Customer:</span>
                    <strong className="text-white font-semibold">{activeProject.customerName}</strong>
                  </div>
                  <div className="border-l border-slate-700 pl-4">
                    <span className="text-slate-400 block">Supplier:</span>
                    <strong className="text-white font-semibold">{activeProject.supplierName || 'Internal'}</strong>
                  </div>
                  <div className="border-l border-slate-700 pl-4">
                    <span className="text-slate-400 block">Budget:</span>
                    <strong className="text-emerald-400 font-semibold">${activeProject.budget.toLocaleString()} {activeProject.currency}</strong>
                  </div>
                  <div className="border-l border-slate-700 pl-4">
                    <span className="text-slate-400 block">Due Date:</span>
                    <strong className="text-amber-400 font-semibold">{activeProject.dueDate}</strong>
                  </div>
                </div>
              </div>

              {/* Stage Stepper */}
              <div className="mt-5 border-t border-slate-800/80 pt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-medium">Stage Gate Workflow Status</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Advance Stage:</span>
                    {(['backlog', 'planning', 'in_progress', 'review', 'completed'] as WorkspaceStage[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateProjectStage(activeProject.id, st)}
                        className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                          activeProject.stage === st
                            ? 'bg-indigo-500 text-white font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 1: KANBAN BOARD */}
          {projectViewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { status: 'todo', title: 'To-Do / Backlog', color: 'border-slate-300 bg-slate-50/50' },
                { status: 'in_progress', title: 'In Progress (Active Work)', color: 'border-blue-300 bg-blue-50/20' },
                { status: 'review', title: 'Review & Client QA', color: 'border-amber-300 bg-amber-50/20' },
                { status: 'done', title: 'Completed & Certified', color: 'border-emerald-300 bg-emerald-50/20' }
              ].map(column => {
                const tasksInCol = workspaceTasks.filter(t => t.status === column.status);
                return (
                  <div key={column.status} className={`border rounded-xl p-4 ${column.color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-gray-900">{column.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700">
                          {tasksInCol.length}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                      {tasksInCol.map(task => {
                        const doneCount = task.checklistItems.filter(c => c.done).length;
                        const totalCount = task.checklistItems.length;
                        return (
                          <div 
                            key={task.id}
                            className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedTaskForDetail(task)}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                                {task.projectCode}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                task.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                                task.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-gray-900 leading-snug">{task.title}</h4>

                            {task.workflowRule && (
                              <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-2 border border-amber-200/60 leading-tight">
                                <strong>Rule:</strong> {task.workflowRule}
                              </p>
                            )}

                            {/* Checklist Progress Bar */}
                            {totalCount > 0 && (
                              <div className="mt-2.5">
                                <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                                  <span>Checklist</span>
                                  <span className="font-semibold text-gray-700">{doneCount}/{totalCount}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1">
                                  <div 
                                    className="bg-indigo-600 h-1 rounded-full" 
                                    style={{ width: `${(doneCount / totalCount) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                              <span>Due: <strong className="text-gray-700">{task.dueDate}</strong></span>
                              <span className="text-gray-600 font-medium">{task.assignee.split(' ')[0]}</span>
                            </div>

                            {/* Fast status switcher */}
                            <div className="mt-2.5 flex items-center space-x-1 pt-1.5 border-t border-gray-100 text-[10px]">
                              <span className="text-gray-400">Move:</span>
                              {(['todo', 'in_progress', 'review', 'done'] as const).filter(s => s !== task.status).map(s => (
                                <button
                                  key={s}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateTaskStatus(task.id, s);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-600 cursor-pointer font-medium capitalize"
                                >
                                  {s.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {tasksInCol.length === 0 && (
                        <div className="h-28 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No tasks in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: GANTT / TIMELINE */}
          {projectViewMode === 'timeline' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Project Gantt & Milestone Dependency Schedule</h3>
                <span className="text-xs text-gray-500">Q3 - Q4 2026 Deliverables Horizon</span>
              </div>

              <div className="space-y-4">
                {workspaceProjects.map(proj => (
                  <div key={proj.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs mb-2">
                      <div className="flex items-center space-x-2">
                        <strong className="font-bold text-gray-900">{proj.name}</strong>
                        <span className="font-mono text-gray-500">[{proj.code}]</span>
                      </div>
                      <span className="text-gray-500">{proj.startDate} → <strong className="text-indigo-600">{proj.dueDate}</strong></span>
                    </div>

                    <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 h-4 rounded-full flex items-center justify-end pr-2 text-[10px] font-bold text-white transition-all duration-500"
                        style={{ width: `${Math.max(proj.progressPct, 12)}%` }}
                      >
                        {proj.progressPct}%
                      </div>
                    </div>

                    {/* Subtasks under this project */}
                    <div className="mt-3 pl-3 border-l-2 border-indigo-200 space-y-1.5">
                      {workspaceTasks.filter(t => t.projectId === proj.id).map(t => (
                        <div key={t.id} className="flex items-center justify-between text-xs py-1">
                          <span className="text-gray-700 flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${t.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span>{t.title}</span>
                          </span>
                          <span className="text-gray-400 font-mono text-[11px]">{t.dueDate} ({t.actualHours}/{t.estimatedHours}h)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: TABLE */}
          {projectViewMode === 'table' && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                    <th className="py-3 px-4">Task ID</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Assignee</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Hours (Act/Est)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workspaceTasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs text-gray-500">{task.id}</td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-indigo-700">{task.projectCode}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{task.title}</td>
                      <td className="py-3 px-4 text-gray-700">{task.assignee}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          task.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                          task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-gray-700">{task.dueDate}</td>
                      <td className="py-3 px-4 text-xs font-mono text-gray-600">{task.actualHours}h / {task.estimatedHours}h</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${
                          task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                          task.status === 'review' ? 'bg-amber-100 text-amber-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedTaskForDetail(task)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                        >
                          Checklist ({task.checklistItems.filter(c => c.done).length}/{task.checklistItems.length})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUBMISSION CHECKLIST (OASIS Phase II Standard) */}
      {activeTab === 'submissionChecklist' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
                  Proposal & Qualifying Project Compliance
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-1">
                  Multi-Document Submission Checklist & Gate Verification
                </h2>
                <p className="text-xs text-gray-500">
                  Standardized compliance audit matrix for Federal Qualifying Projects, aerospace certifications, and supplier deliverables.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Auditing:</span>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded border">
                  PRJ-2026-AVION (OASIS-QP-AVION-884)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {workspaceChecklists.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.isVerified 
                      ? 'border-emerald-200 bg-emerald-50/30' 
                      : item.isSubmitted 
                        ? 'border-amber-200 bg-amber-50/30' 
                        : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{item.category}</span>
                      <h4 className="text-sm font-bold text-gray-900">{item.itemTitle}</h4>
                      <p className="text-xs text-gray-500">
                        Required Artifact: <span className="font-medium text-gray-700">{item.requiredDocumentType}</span>
                      </p>
                      {item.notes && (
                        <p className="text-xs text-amber-800 italic">Note: {item.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {item.isVerified ? (
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ Verified & Signed Off
                          </span>
                          <span className="block text-[10px] text-gray-400 mt-0.5">By {item.verifiedBy} on {item.verifiedAt}</span>
                        </div>
                      ) : item.isSubmitted ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ⏳ Submitted (Pending Audit)
                          </span>
                          <button
                            onClick={() => handleVerifyWorkspaceChecklist(item.id, currentUser || 'Lead Auditor')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer shadow-sm transition-colors"
                          >
                            Sign & Certify Gate
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-600">
                            ✕ Not Submitted
                          </span>
                          <button
                            onClick={() => setShowUploadDocModal(true)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold cursor-pointer shadow-sm transition-colors"
                          >
                            Upload Artifact
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL DMS & FILESMART DOCUMENT REPOSITORY */}
      {activeTab === 'dms' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Digital Document Management System (DMS)</h2>
                <p className="text-xs text-gray-500">FileSmart central repository with approval workflows, revision trees, and digital e-signature stamps.</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUploadDocModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  + Upload Document
                </button>
              </div>
            </div>

            {/* Document Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                    <th className="py-3 px-4">Doc Code</th>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Version</th>
                    <th className="py-3 px-4">Type & Size</th>
                    <th className="py-3 px-4">Uploaded By</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Signatures</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workspaceDocuments.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-indigo-700">{doc.docNumber}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 block">{doc.title}</span>
                        {doc.customerOrSupplierName && (
                          <span className="text-[11px] text-gray-400">Partner: {doc.customerOrSupplierName}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                          {doc.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-gray-600">{doc.version}</td>
                      <td className="py-3 px-4 text-xs font-mono text-gray-500 uppercase">
                        {doc.fileType} • {doc.fileSize}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-700">{doc.uploadedBy}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                          doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          doc.status === 'pending_approval' ? 'bg-amber-100 text-amber-800' :
                          doc.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {doc.eSignatures.length > 0 ? (
                          <span className="text-emerald-700 font-bold flex items-center space-x-1">
                            <span>✓ {doc.eSignatures.length} Signed</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedDocId(doc.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                          >
                            Inspect
                          </button>
                          {doc.status === 'pending_approval' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedDocId(doc.id);
                                  setShowSignDocModal(true);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer"
                              >
                                Sign
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDocId(doc.id);
                                  setShowRejectDocModal(true);
                                }}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMERS & SUPPLIERS */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Stakeholder Collaborative Directory</h2>
                <p className="text-xs text-gray-500">Comprehensive customer accounts and certified supplier scorecards.</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-1 rounded-lg flex items-center space-x-1 text-xs font-bold">
                  <button
                    onClick={() => setPartnerTypeToggle('customers')}
                    className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                      partnerTypeToggle === 'customers' ? 'bg-white shadow text-indigo-700' : 'text-gray-600'
                    }`}
                  >
                    Customers ({workspaceCustomers.length})
                  </button>
                  <button
                    onClick={() => setPartnerTypeToggle('suppliers')}
                    className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                      partnerTypeToggle === 'suppliers' ? 'bg-white shadow text-indigo-700' : 'text-gray-600'
                    }`}
                  >
                    Suppliers ({workspaceSuppliers.length})
                  </button>
                </div>

                <button
                  onClick={() => setShowAddPartnerModal(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                >
                  + Add {partnerTypeToggle === 'customers' ? 'Customer' : 'Supplier'}
                </button>
              </div>
            </div>

            {/* Customers View */}
            {partnerTypeToggle === 'customers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaceCustomers.map(cust => (
                  <div key={cust.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {cust.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {cust.tier} Client
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900">{cust.name}</h3>
                    <p className="text-xs text-gray-500">{cust.industry} • {cust.region}</p>

                    <div className="mt-3 grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-gray-100 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Contract Value</span>
                        <strong className="text-gray-900">${(cust.totalContractValue / 1000).toLocaleString()}k</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Active Projects</span>
                        <strong className="text-indigo-600">{cust.activeProjectsCount}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">SLA Adherence</span>
                        <strong className="text-emerald-600">{cust.slaCompliancePct}%</strong>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                      <span>Contact: <strong>{cust.contactPerson}</strong></span>
                      <a href={`mailto:${cust.email}`} className="text-indigo-600 hover:underline">{cust.email}</a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suppliers View */}
            {partnerTypeToggle === 'suppliers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaceSuppliers.map(supp => (
                  <div key={supp.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {supp.code}
                      </span>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        ⭐ {supp.rating} / 5.0 Rating
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900">{supp.name}</h3>
                    <p className="text-xs text-gray-500">{supp.category} • {supp.country}</p>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {supp.certifications.map((cert, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                          {cert}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-gray-100 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px]">On-Time Delivery</span>
                        <strong className="text-emerald-600">{supp.onTimeDeliveryPct}%</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Open Work Orders</span>
                        <strong className="text-indigo-600">{supp.openOrdersCount} Orders</strong>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                      <span>Rep: <strong>{supp.contactPerson}</strong></span>
                      <span className="text-gray-500">{supp.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: CHANNELS & COLLABORATION */}
      {activeTab === 'communication' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm min-h-[550px]">
          {/* Channels Sidebar */}
          <div className="border-r border-gray-200 p-4 bg-gray-50/70 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stakeholder Channels</h3>
            <div className="space-y-1">
              {[
                { id: 'chan-aerospace', name: 'apex-avionics-sync', unread: 2 },
                { id: 'chan-procurement', name: 'global-suppliers-rfq', unread: 0 },
                { id: 'chan-quality', name: 'qa-first-article-approvals', unread: 3 },
                { id: 'chan-executive', name: 'executive-portfolio-brief', unread: 0 }
              ].map(chan => (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                    activeChannelId === chan.id 
                      ? 'bg-indigo-600 text-white shadow' 
                      : 'text-gray-700 hover:bg-gray-200/60'
                  }`}
                >
                  <span className="truncate">#{chan.name}</span>
                  {chan.unread > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeChannelId === chan.id ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
                    }`}>
                      {chan.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
              <span className="font-bold text-gray-700 block mb-1">Participants Online (3):</span>
              <ul className="space-y-1 text-[11px]">
                <li className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>David Vance (Apex VP)</span></li>
                <li className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Markus Weber (Titan Lead)</span></li>
                <li className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Dr. Aris Thorne (QA)</span></li>
              </ul>
            </div>
          </div>

          {/* Active Channel Message Thread */}
          <div className="lg:col-span-3 p-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-900">#{activeChannelId}</h3>
                  <span className="text-xs text-gray-400">Collaborative stream encrypted with AES-256</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ● Real-Time Connected
                </span>
              </div>

              {/* Message History */}
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                {activeChannelMessages.map(msg => (
                  <div key={msg.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <img 
                      src={msg.senderAvatar} 
                      alt={msg.senderName} 
                      className="w-9 h-9 rounded-full object-cover border border-gray-300 flex-shrink-0" 
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-baseline space-x-2">
                        <strong className="text-xs font-bold text-gray-900">{msg.senderName}</strong>
                        <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">{msg.senderRole}</span>
                        <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{msg.message}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-800 font-mono">
                              <span>📎</span>
                              <span>{att.name} ({att.size})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="mt-4 border-t border-gray-200 pt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Post update to channel or attach document hash..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 7: PORTAL LOGIN (login.jsp) & MFA ACCESS CONSOLE */}
      {activeTab === 'portalAccess' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            {/* Header replicate of oasis/login.jsp without branding */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white text-center">
              <div className="inline-flex p-3 bg-indigo-600 rounded-xl shadow-lg mb-2">
                <WorkspaceIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">Enterprise Unified Workspace Portal</h2>
              <p className="text-xs text-indigo-200 mt-1">
                Standard Multi-Agency & Corporate Single Sign-On Gateway (oasis/login.jsp)
              </p>
            </div>

            <div className="p-8">
              {portalAuthStatus === 'AWAITING_2FA' ? (
                /* 2FA Verification Screen */
                <form onSubmit={handleVerify2fa} className="space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Two-Factor Authentication Required
                    </span>
                    <h3 className="text-base font-bold text-gray-900">Enter Security Verification Code</h3>
                    <p className="text-xs text-gray-500">
                      A 6-digit TOTP code was generated for user <strong>{portalUserId}</strong>.
                    </p>
                  </div>

                  <div className="py-4">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 589201"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full text-center tracking-widest font-mono text-2xl py-3 border-2 border-indigo-500 rounded-lg focus:outline-none"
                      autoFocus
                    />
                    <span className="block text-center text-xs text-gray-400 mt-1">Test bypass code: Any 6 digits</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Confirm & Enter Workspace
                  </button>

                  <button
                    type="button"
                    onClick={() => setPortalAuthStatus('LOGGED_OUT')}
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                  >
                    Cancel and Return to Login
                  </button>
                </form>
              ) : (
                /* Standard Login Form */
                <form onSubmit={handlePortalLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Company Workspace Domain</label>
                    <select
                      value={portalDomain}
                      onChange={(e) => setPortalDomain(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="TENANT-NORTH-AMERICA">TENANT-NORTH-AMERICA (Default Cluster)</option>
                      <option value="TENANT-EMEA-SUPPLY">TENANT-EMEA-SUPPLY (Frankfurt Region)</option>
                      <option value="TENANT-GLOBAL-PARTNERS">TENANT-GLOBAL-PARTNERS (Worldwide)</option>
                      <option value="DEMO-ENTERPRISE-WS">DEMO-ENTERPRISE-WS (Sandbox)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">User ID / Corporate Email</label>
                    <input
                      type="email"
                      value={portalUserId}
                      onChange={(e) => setPortalUserId(e.target.value)}
                      required
                      placeholder="user@enterprise-workspace.com"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={portalPassword}
                      onChange={(e) => setPortalPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span className="text-gray-600">Remember me on this computer</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Log In to Workspace
                  </button>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setShowActivationModal(true)}
                      className="text-indigo-600 hover:underline font-bold cursor-pointer"
                    >
                      Activate new account (activate.jsp)
                    </button>

                    <span className="text-gray-400 font-mono text-[11px]">Build Standard 2026.10</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT DOCUMENT */}
      {inspectingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {inspectingDoc.docNumber}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{inspectingDoc.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedDocId(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Simulated Document Preview Paper */}
            <div className="border border-gray-300 rounded-lg p-6 bg-slate-50 font-serif text-xs space-y-4 shadow-inner">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold uppercase tracking-widest text-slate-700">OmniWorkspace Verification Dossier</span>
                <span className="font-mono text-gray-500">Security Clearance: Confidential</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{inspectingDoc.title}</h4>
                <p className="text-gray-600 mt-1">Classification: {inspectingDoc.category.toUpperCase()} • File Revision: {inspectingDoc.version}</p>
              </div>

              <div className="p-3 bg-white rounded border border-gray-200 font-sans text-xs space-y-2">
                <p className="text-gray-700">
                  This electronic record is verified under ISO 9001 / AS9100D document control protocols. 
                  Digital hashes are signed with SHA-256 and stored within the tenant audit register.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                  <div>Associated Project: <strong>{inspectingDoc.associatedProjectId || 'PRJ-2026-AVION'}</strong></div>
                  <div>Originating Entity: <strong>{inspectingDoc.customerOrSupplierName || 'Enterprise Partner'}</strong></div>
                </div>
              </div>

              {/* Digital E-Signature Stamps Block */}
              <div className="border-t border-gray-300 pt-3">
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Cryptographic E-Signatures ({inspectingDoc.eSignatures.length})
                </span>

                {inspectingDoc.eSignatures.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {inspectingDoc.eSignatures.map((sig, idx) => (
                      <div key={idx} className="p-2.5 bg-emerald-50/80 border border-emerald-300 rounded text-emerald-900 font-sans text-[11px]">
                        <div className="font-bold flex items-center justify-between">
                          <span>{sig.signerName}</span>
                          <span className="text-[10px] text-emerald-700">{sig.role}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block">{sig.signedAt}</span>
                        <span className="font-mono text-[9px] text-gray-400 block truncate mt-1">{sig.signatureHash}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs font-sans">
                    Awaiting digital signature authorization from Lead QA or Compliance Officer.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedDocId(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SIGN DOCUMENT */}
      {showSignDocModal && inspectingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Apply Digital E-Signature Stamp</h3>
            <p className="text-xs text-gray-500">
              Applying your signature verifies conformance to specification {inspectingDoc.docNumber}.
            </p>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 space-y-1">
              <div>Signer: <strong>{currentUser || 'Sarah Jenkins'}</strong></div>
              <div>Role: <strong>Workspace Lead / Certified Auditor</strong></div>
              <div>Algorithm: <strong>SHA-256 + Time-Stamping Authority (RFC 3161)</strong></div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSignDocModal(false)}
                className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSignWorkspaceDocument(inspectingDoc.id, currentUser || 'Sarah Jenkins', 'Lead Program Director');
                  setShowSignDocModal(false);
                  setSelectedDocId(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Confirm & Apply Stamp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT DOCUMENT */}
      {showRejectDocModal && inspectingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Reject Document with Audit Feedback</h3>
            <textarea
              rows={3}
              placeholder="Specify non-conformance details (e.g. dimensional tolerance breach)..."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectDocModal(false)}
                className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRejectWorkspaceDocument(inspectingDoc.id, rejectionReasonInput || 'Tolerance review required');
                  setShowRejectDocModal(false);
                  setSelectedDocId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Reject & Issue NCR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TASK DETAIL & CHECKLIST */}
      {selectedTaskForDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-mono font-bold text-indigo-600">{selectedTaskForDetail.projectCode}</span>
              <button onClick={() => setSelectedTaskForDetail(null)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>

            <h3 className="text-base font-bold text-gray-900">{selectedTaskForDetail.title}</h3>
            {selectedTaskForDetail.workflowRule && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                <strong>Stage Gate Rule:</strong> {selectedTaskForDetail.workflowRule}
              </p>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Checklist Items</h4>
              <div className="space-y-2">
                {selectedTaskForDetail.checklistItems.map(item => (
                  <label key={item.id} className="flex items-start space-x-2 text-xs text-gray-700 p-2 bg-gray-50 rounded hover:bg-indigo-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleWorkspaceChecklistItem(selectedTaskForDetail.id, item.id)}
                      className="mt-0.5 rounded text-indigo-600 w-4 h-4"
                    />
                    <span className={item.done ? 'line-through text-gray-400' : 'font-medium'}>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTaskForDetail(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW PROJECT */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={submitNewProject} className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-bold text-gray-900">Create New Collaborative Workspace Project</h3>
              <button type="button" onClick={() => setShowNewProjectModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Pressure Hydraulic Valve Qualification"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Project Code</label>
                  <input
                    type="text"
                    placeholder="PRJ-2026-HYD"
                    value={newProjCode}
                    onChange={(e) => setNewProjCode(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={newProjDueDate}
                    onChange={(e) => setNewProjDueDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Customer</label>
                  <select
                    value={newProjCustomer}
                    onChange={(e) => setNewProjCustomer(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  >
                    {workspaceCustomers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Supplier</label>
                  <select
                    value={newProjSupplier}
                    onChange={(e) => setNewProjSupplier(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  >
                    {workspaceSuppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Budget (USD)</label>
                <input
                  type="number"
                  value={newProjBudget}
                  onChange={(e) => setNewProjBudget(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Scope & Description</label>
                <textarea
                  rows={2}
                  placeholder="Outline key deliverables, testing parameters, and compliance standards..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: NEW TASK */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={submitNewTask} className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-bold text-gray-900">Add Task to Project Gate</h3>
              <button type="button" onClick={() => setShowNewTaskModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coordinate Measuring Machine Optical Inspection"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as WorkspacePriority)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={newTaskHours}
                    onChange={(e) => setNewTaskHours(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Workflow Validation Rule</label>
                <input
                  type="text"
                  value={newTaskWorkflowRule}
                  onChange={(e) => setNewTaskWorkflowRule(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: UPLOAD DMS FILE */}
      {showUploadDocModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={submitUploadDoc} className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-bold text-gray-900">Upload to FileSmart DMS</h3>
              <button type="button" onClick={() => setShowUploadDocModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Helium Leak Check Protocol Certificate"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as WorkspaceDocCategory)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  >
                    <option value="qa_certificate">QA Certificate</option>
                    <option value="contract">Contract / SOW</option>
                    <option value="specification">Specification</option>
                    <option value="drawing">Drawing / CAD</option>
                    <option value="financial">Financial / Tax</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">File Format</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg uppercase"
                  >
                    <option value="pdf">PDF</option>
                    <option value="png">PNG</option>
                    <option value="docx">DOCX</option>
                    <option value="dwg">DWG (CAD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Revision Version</label>
                  <input
                    type="text"
                    value={newDocVersion}
                    onChange={(e) => setNewDocVersion(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Metadata Tags</label>
                  <input
                    type="text"
                    value={newDocTags}
                    onChange={(e) => setNewDocTags(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadDocModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Upload & Register Hash
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ACCOUNT ACTIVATION (activate.jsp) */}
      {showActivationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-bold text-gray-900">Activate Enterprise Account</h3>
              <button onClick={() => setShowActivationModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>
            <p className="text-xs text-gray-500">
              Enter the corporate activation token provided by your workspace administrator (Standard activate.jsp).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Activation Code</label>
                <input
                  type="text"
                  placeholder="ACT-8891-XK9"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Corporate Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={activationEmail}
                  onChange={(e) => setActivationEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowActivationModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResetSuccessBanner(`Account ${activationEmail || 'user'} successfully activated! You may now sign in.`);
                  setShowActivationModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Verify & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORGOT PASSWORD (forgotPassword.jsp) */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-bold text-gray-900">Reset Password (forgotPassword.jsp)</h3>
              <button onClick={() => setShowForgotPasswordModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>
            <p className="text-xs text-gray-500">
              Provide your corporate user ID or registered email. A password reset token will be dispatched.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">User ID or Registered Email</label>
                <input
                  type="email"
                  placeholder="name@enterprise.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResetSuccessBanner(`Temporary recovery instructions sent to ${forgotEmail || portalUserId}.`);
                  setShowForgotPasswordModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Request Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OmniWorkspace;
