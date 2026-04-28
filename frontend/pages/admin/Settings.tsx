import React, { useState } from 'react';
import { 
    Settings as SettingsIcon, Bell, Shield,
    User, Save, Moon, Sun, Lock, Globe
} from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const Settings = ({ user }: { user: any }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and office preferences</p>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8 space-y-8">
              <section className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                      <User size={20} className="text-primary" /> Profile Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                          <input type="text" defaultValue={user.name} className="w-full p-2.5 bg-muted border border-border rounded-xl outline-none" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                          <input type="email" defaultValue={user.email} className="w-full p-2.5 bg-muted border border-border rounded-xl outline-none" />
                      </div>
                  </div>
              </section>

              <section className="space-y-4 pt-8 border-t">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                      <Shield size={20} className="text-primary" /> Security
                  </h3>
                  <Button variant="outline">Change Password</Button>
              </section>

              <div className="pt-8 border-t flex justify-end">
                  <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">
                      <Save size={18} /> Save Changes
                  </Button>
              </div>
          </Card>

          <aside className="space-y-6">
              <Card className="p-6 bg-primary/5 border-primary/10">
                  <h4 className="font-bold mb-2">Office Configuration</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                      You are currently managing the <span className="font-bold text-primary">{user.office_type}</span> office at your institution.
                  </p>
              </Card>
          </aside>
      </div>
    </div>
  );
};
