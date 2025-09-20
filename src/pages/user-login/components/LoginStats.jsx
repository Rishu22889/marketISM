
import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginStats = () => {
  const stats = [
    {
      icon: 'Users',
      value: '2,500+',
      label: 'Active Students'
    },
    {
      icon: 'Package',
      value: '1,200+',
      label: 'Items Listed'
    },
    {
      icon: 'TrendingUp',
      value: '95%',
      label: 'Success Rate'
    }
  ];

  return (
    <div className="hidden lg:block">
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Join Our Growing Community
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {stats?.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name={stat?.icon} size={20} color="white" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">
                  {stat?.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat?.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Recent Activity
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Physics textbook sold - 2 mins ago</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>New laptop listing - 5 mins ago</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Cycle reserved - 8 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginStats;
