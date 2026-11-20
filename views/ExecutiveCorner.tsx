import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { useBranding } from '../BrandingContext';
import { formatCurrency } from '../utils/formatters';
import type { StrategicGoal } from './types';
import QuantumIcon from '../components/icons/QuantumIcon';

const GoalCard: React.FC<{ goal: StrategicGoal }> = ({ goal }) => {
    const progress = (goal.current / goal.target) * 100;
    const statusColor = goal.status === 'On Track' ? 'bg-green-500' : goal.status === 'At Risk' ? 'bg-yellow-500' : 'bg-blue-500';

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800 text-lg">{goal.title}</p>
                    <p className="text-sm text-gray-500">{goal.quarter}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColor}`}>
                    {goal.status}
                </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
            <div className="mt-4">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>{goal.kpi}</span>
                    <span>{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className={`${statusColor} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const ScenarioSimulator: React.FC = () => {
    const [scenario, setScenario] = useState('');
    const [outcome, setOutcome] = useState('');

    const handleSimulate = () => {
        let result = '';
        switch (scenario) {
            case 'rate_hike':
                result = "Simulated Outcome:\n- Net Interest Margin (NIM) may increase by 0.15%.\n- Potential for 5% increase in loan defaults in the MSME sector.\n- Recommendation: Stress-test portfolio and review credit policies.";
                break;
            case 'market_downturn':
                result = "Simulated Outcome:\n- Loan demand may decrease by 10%.\n- NPA levels could rise to 5.5%.\n- Recommendation: Increase liquidity reserves and focus on collections.";
                break;
            case 'new_product':
                result = "Simulated Outcome:\n- Potential to capture 2% of the market in the first year.\n- Estimated setup cost: ₹50,00,000.\n- Recommendation: Conduct detailed market research and build a pilot program.";
                break;
            case 'quantum_optimization':
                result = "Quantum Simulation Complete:\n- Optimal asset allocation identified for maximizing returns while minimizing risk by 25% compared to classical models.\n- Identified 3 high-potential but high-risk assets previously overlooked.\n- Recommendation: Rebalance portfolio according to the quantum-derived allocation. Estimated alpha increase of 2.5% over the next fiscal year.";
                break;
            default:
                result = "Please select a scenario to simulate.";
        }
        setOutcome(result);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Scenario Simulator (What-If Analysis)</h3>
            <div className="flex items-center space-x-2">
                <select value={scenario} onChange={e => setScenario(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm">
                    <option value="">-- Select Scenario --</option>
                    <option value="rate_hike">Interest Rate Hike (+0.5%)</option>
                    <option value="market_downturn">Market Downturn (-10% Growth)</option>
                    <option value="new_product">Launch New 'Agri-Tech' Loan Product</option>
                    <option value="quantum_optimization">Quantum Portfolio Optimization</option>
                </select>
                <button onClick={handleSimulate} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark">Simulate</button>
            </div>
            {outcome && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{outcome}</p>
                </div>
            )}
        </div>
    );
};

const InnovationPipeline: React.FC = () => {
    const ideas = {
        'Idea': [{id: 'i1', text: 'AI-based credit scoring model'}],
        'Validation': [{id: 'v1', text: 'Blockchain for loan documentation'}],
        'Development': [{id: 'd1', text: 'Customer-facing mobile app'}],
        'Launched': [{id: 'l1', text: 'Digital KYC process'}],
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Innovation Pipeline</h3>
            <div className="grid grid-cols-4 gap-4">
                {Object.entries(ideas).map(([stage, items]) => (
                    <div key={stage} className="bg-gray-100 p-3 rounded-lg">
                        <h4 className="font-semibold text-sm text-gray-600 mb-3 text-center">{stage}</h4>
                        <div className="space-y-2">
                            {items.map(item => (
                                <div key={item.id} className="bg-white p-2 rounded shadow text-sm">{item.text}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ExecutiveCorner: React.FC = () => {
    const { strategicGoals } = useAppContext();

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
              <QuantumIcon />
              <h2 className="text-3xl font-bold text-gray-800">Executive Corner</h2>
            </div>
            
            <div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Strategic Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {strategicGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                </div>
            </div>

            <ScenarioSimulator />

            <InnovationPipeline />
            
        </div>
    );
};

export default ExecutiveCorner;