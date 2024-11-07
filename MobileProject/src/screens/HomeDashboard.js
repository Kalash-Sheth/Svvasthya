import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const HomeDashboard = ({ attendantName }) => {
  // Sample appointment data
  const currentAppointment = {
    client: 'John Smith',
    service: 'Nursing',
    date: 'Today, 10:00 AM',
    location: '123 Main St, Anytown USA',
    instructions: 'Please arrive 10 minutes early.'
  };

  const upcomingAppointments = [
    {
      client: 'Emily Johnson',
      service: 'Companionship',
      date: 'Tomorrow, 2:00 PM',
      location: '456 Oak Rd, Anytown USA',
      instructions: 'Bring a board game to play together.'
    },
    {
      client: 'Sarah Lee',
      service: 'Nursing',
      date: 'Friday, 9:30 AM',
      location: '789 Elm St, Anytown USA',
      instructions: 'Assist with morning routine.'
    }
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Welcome, Svvasthya Saathi! {attendantName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Availability Status</span>
              <Switch
                checked={true}
                onChange={(checked) => console.log(`Availability status set to: ${checked}`)}
                className="ml-4"
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Current Appointment</h3>
            <div className="bg-gray-100 p-4 rounded-lg cursor-pointer">
              <h4 className="font-medium">{currentAppointment.client} - {currentAppointment.service}</h4>
              <p className="text-gray-500">{currentAppointment.date}</p>
              <p className="text-gray-500">{currentAppointment.location}</p>
              <p className="text-gray-500">{currentAppointment.instructions}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Upcoming Appointments</h3>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg cursor-pointer">
                  <h4 className="font-medium">{appointment.client} - {appointment.service}</h4>
                  <p className="text-gray-500">{appointment.date}</p>
                  <p className="text-gray-500">{appointment.location}</p>
                  <p className="text-gray-500">{appointment.instructions}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg w-full">
              Emergency Contact
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeDashboard;