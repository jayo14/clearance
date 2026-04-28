import React, { useState, useEffect } from 'react';
import { 
    BarChart2, TrendingUp, PieChart, Download,
    Users, CheckCircle, XCircle, Clock, RefreshCw
} from 'lucide-react';
import { Card, Button, LoadingSpinner } from '../../components/UI';
import { recordService } from '../../services/recordService';

export const Analytics = ({ user }: { user: any }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await recordService.getOfficerClearanceList();
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Handled', value: items.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Approved', value: items.filter(i => i.status === 'approved').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejected', value: items.filter(i => i.status === 'rejected').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Pending', value: items.filter(i => i.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              <p className="text-sm text-muted-foreground">Clearance performance and metrics for your office</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download size={14} /> Download Report
          </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
              <Card key={i} className="p-6 border-border hover:shadow-lg transition-all">
                  <div className={`p-2 w-10 h-10 rounded-lg ${stat.bg} ${stat.color} mb-4 flex items-center justify-center`}>
                      <stat.icon size={20} />
                  </div>
                  <h3 className="text-2xl font-black">{stat.value}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </Card>
          ))}
      </div>

      <Card className="p-20 text-center flex flex-col items-center border-none bg-muted/30">
          <BarChart2 size={48} className="text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-bold">Performance Visualization</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
              Detailed charts and trends will appear here as more clearance data is processed.
          </p>
      </Card>
    </div>
  );
};
