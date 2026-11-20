import React from 'react';

const ChartNode: React.FC<{ title: string; items: string[]; color: string; className?: string }> = ({ title, items, color, className }) => (
    <div className={`bg-white p-4 rounded-lg shadow-lg border-t-4 ${className}`} style={{borderColor: color}}>
        <h3 className="font-bold text-center text-lg mb-2" style={{color: color}}>{title}</h3>
        <ul className="space-y-1 text-center text-gray-600">
            {items.map(item => <li key={item}>{item}</li>)}
        </ul>
    </div>
);

const Connector: React.FC<{ parent: string; children: string[] }> = ({ parent, children }) => (
    // This is a simplified connector visualization. A real implementation might use SVG.
    <div className="relative my-4 h-8 flex justify-center items-center">
        <div className="absolute top-0 w-px h-full bg-gray-300"></div>
    </div>
);


const OrganizationChart: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Organizational Hierarchy</h2>
      <div className="bg-gray-50 p-8 rounded-xl">
        <div className="flex flex-col items-center space-y-8">
            {/* Level 1 */}
            <ChartNode title="Super Admin" items={["Platform Owner"]} color="#6366f1" className="w-1/4" />
            
            <div className="w-px h-12 bg-gray-300"></div>

            {/* Level 2 */}
             <div className="flex justify-around w-full max-w-2xl">
                <ChartNode title="Administration" items={["Finance Admin", "Operations Admin"]} color="#3b82f6" className="w-1/3" />
                <ChartNode title="Auditors" items={["Internal Audit Team"]} color="#f97316" className="w-1/3" />
            </div>

            <div className="w-full flex justify-center">
                <div className="w-1/2 h-px bg-gray-300 relative">
                     <div className="absolute left-1/4 -top-px w-px h-12 bg-gray-300 transform -translate-x-1/2 -translate-y-full"></div>
                     <div className="absolute right-1/4 -top-px w-px h-12 bg-gray-300 transform translate-x-1/2 -translate-y-full"></div>
                     <div className="absolute left-1/2 -bottom-px w-px h-12 bg-gray-300 transform -translate-x-1/2 translate-y-full"></div>
                </div>
            </div>

            {/* Level 3 */}
            <div className="flex justify-around w-full max-w-4xl">
                <ChartNode title="Credit & Underwriting" items={["Credit Manager", "Analysts"]} color="#10b981" />
                <ChartNode title="Sales & Leasing" items={["Sales Head", "Field Agents"]} color="#10b981" />
                <ChartNode title="Collections & Recovery" items={["Collections Manager", "Officers"]} color="#10b981" />
            </div>
            
             <div className="w-full flex justify-center">
                <div className="w-3/4 h-px bg-gray-300 relative">
                    <div className="absolute left-[16.6%] -top-px w-px h-12 bg-gray-300 transform -translate-y-full"></div>
                    <div className="absolute left-1/2 -top-px w-px h-12 bg-gray-300 transform -translate-y-full"></div>
                    <div className="absolute right-[16.6%] -top-px w-px h-12 bg-gray-300 transform -translate-y-full"></div>
                </div>
            </div>


        </div>
      </div>
    </div>
  );
};

export default OrganizationChart;
