import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', actual: 65, predicted: 62 },
  { name: '04:00', actual: 59, predicted: 60 },
  { name: '08:00', actual: 80, predicted: 78 },
  { name: '12:00', actual: 81, predicted: 80 },
  { name: '16:00', actual: 56, predicted: 58 },
  { name: '20:00', actual: 55, predicted: 57 },
];

const MachineLearningContent = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Water Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">75.3 m</div>
            <p className="text-gray-500">Last updated: 5 minutes ago</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">94.8%</div>
            <p className="text-gray-500">Last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next 24h Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">77.2 m</div>
            <p className="text-gray-500">Expected peak level</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Water Level Prediction vs Actual</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#2563eb" name="Actual Level" />
              <Line type="monotone" dataKey="predicted" stroke="#dc2626" name="Predicted Level" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>MAE</span>
                  <span>1.23</span>
                </div>
                <div className="w-full bg-gray-200 rounded">
                  <div className="bg-blue-600 h-2 rounded" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>RMSE</span>
                  <span>1.67</span>
                </div>
                <div className="w-full bg-gray-200 rounded">
                  <div className="bg-blue-600 h-2 rounded" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>R²</span>
                  <span>0.95</span>
                </div>
                <div className="w-full bg-gray-200 rounded">
                  <div className="bg-blue-600 h-2 rounded" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '2024-03-16 08:30', message: 'Water level exceeded threshold', type: 'warning' },
                { time: '2024-03-16 06:15', message: 'Prediction accuracy dropped', type: 'info' },
                { time: '2024-03-15 23:45', message: 'System maintenance completed', type: 'success' },
              ].map((alert, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="text-sm text-gray-600">{alert.time}</p>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MachineLearningContent;