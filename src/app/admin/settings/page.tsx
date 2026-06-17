
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary">System Settings</h1>
        <p className="text-muted-foreground">Configure global platform parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <h3 className="font-bold text-xl border-b pb-2">General Settings</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Platform Name</Label>
              <Input defaultValue="Bourouisse Piece-Dz" />
            </div>
            <div className="grid gap-2">
              <Label>Support Email</Label>
              <Input defaultValue="support@bourouisse.com" />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h3 className="font-bold text-xl border-b pb-2">Maintenance Mode</h3>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="font-bold text-red-900">Offline Mode</p>
              <p className="text-xs text-red-700">Prevent users from accessing the frontend.</p>
            </div>
            <Switch />
          </div>
          <Button className="w-full">Save Changes</Button>
        </Card>
      </div>
    </div>
  );
}
