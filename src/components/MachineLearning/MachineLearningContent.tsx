import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const MachineLearningContent: React.FC = () => {
  const inputData = [
    [150.0, 16.0, 229.22, 0.0],
    [175.0, 0.0, 229.35, 0.0],
    [140.0, 0.0, 229.45, 0.0],
    [131.0, 0.0, 229.54, 0.0],
    [133.0, 0.0, 229.63, 0.0],
    [66.0, 0.0, 229.67, 0.0],
    [66.0, 0.0, 229.71, 0.0],
    [52.0, 0.0, 229.74, 0.0],
    [52.0, 0.0, 229.77, 0.0],
    [52.0, 0.0, 229.8, 0.0],
    [40.0, 0.0, 229.82, 0.0],
    [25.0, 0.0, 229.83, 0.0],
    [34.0, 0.0, 229.85, 0.0],
    [32.0, 7.0, 229.86, 6.18],
    [33.0, 38.0, 229.86, 33.53],
    [27.0, 0.0, 229.87, 0.0],
    [15.0, 163.0, 229.7, 143.82],
    [25.0, 26.0, 229.71, 22.94],
    [32.0, 0.0, 229.73, 0.0],
    [25.0, 0.0, 229.74, 0.0],
    [52.0, 57.0, 229.73, 50.29],
    [40.0, 137.0, 229.63, 120.88],
    [30.0, 138.0, 229.52, 121.76],
    [25.0, 104.0, 229.44, 91.76],
    [16.0, 16.0, 229.44, 14.12],
    [16.0, 0.0, 229.44, 0.0],
    [16.0, 0.0, 229.44, 0.0],
  ];

  const [prediction, setPrediction] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memuat model dan melakukan prediksi
  // const handlePredict = async () => {
  //   setLoading(true);
  //   setError(null);
  
  //   try {
  //     // Load model
  //     const model = await tf.loadLayersModel('http://localhost:3000/model/model.json');
  
  //     // Convert input data to tensor
  //     const inputTensor = tf.tensor2d(inputData, [inputData.length, inputData[0].length]);
  
  //     // Perform prediction
  //     const result = model.predict(inputTensor) as tf.Tensor;
  
  //     // Extract prediction data and cast to a number array
  //     const predictionData: number[][] = (await result.array()) as number[][];
  
  //     // Use the first prediction row (if batch size > 1)
  //     setPrediction(predictionData[0]); // Assuming single batch prediction
  //   } catch (err) {
  //     console.error('Error during prediction:', err);
  //     setError('Failed to load the model or predict');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handlePredict = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Load the model
      const model = await tf.loadLayersModel('/model/model.json');


  
      // Example inputData: shape should match [batchSize, 24, 4]
      const inputData: number[][][] = [
        [
          [150.0, 16.0, 229.22, 0.0],
    [175.0, 0.0, 229.35, 0.0],
    [140.0, 0.0, 229.45, 0.0],
    [131.0, 0.0, 229.54, 0.0],
    [133.0, 0.0, 229.63, 0.0],
    [66.0, 0.0, 229.67, 0.0],
    [66.0, 0.0, 229.71, 0.0],
    [52.0, 0.0, 229.74, 0.0],
    [52.0, 0.0, 229.77, 0.0],
    [52.0, 0.0, 229.8, 0.0],
    [40.0, 0.0, 229.82, 0.0],
    [25.0, 0.0, 229.83, 0.0],
    [34.0, 0.0, 229.85, 0.0],
    [32.0, 7.0, 229.86, 6.18],
    [33.0, 38.0, 229.86, 33.53],
    [27.0, 0.0, 229.87, 0.0],
    [15.0, 163.0, 229.7, 143.82],
    [25.0, 26.0, 229.71, 22.94],
    [32.0, 0.0, 229.73, 0.0],
    [25.0, 0.0, 229.74, 0.0],
    [52.0, 57.0, 229.73, 50.29],
    [40.0, 137.0, 229.63, 120.88],
    [30.0, 138.0, 229.52, 121.76],
    [25.0, 104.0, 229.44, 91.76],
    [16.0, 16.0, 229.44, 14.12],
    [16.0, 0.0, 229.44, 0.0],
    [16.0, 0.0, 229.44, 0.0],
        ],
      ];
  
      // Convert input data to tensor
      const inputTensor = tf.tensor(inputData, [1, 24, 4]); // Batch size 1, timesteps 24, features 4
  
      // Perform prediction
      const result = model.predict(inputTensor) as tf.Tensor;
  
      // Extract prediction data
      const predictionData: number[][] = (await result.array()) as number[][];
      console.log(model.summary());

  
      // Use the first prediction row
      setPrediction(predictionData[0]);
    } catch (err) {
      console.error('Error during prediction:', err);
      setError('Failed to load the model or predict');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Machine Learning Prediction</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Input Data from Last 24 Hours</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2">INFLOW</th>
              <th className="border p-2">OUTFLOW</th>
              <th className="border p-2">TMA (Water Level)</th>
              <th className="border p-2">BEBAN (Load)</th>
            </tr>
          </thead>
          <tbody>
            {inputData.map((data, index) => (
              <tr key={index} className="odd:bg-gray-50">
                {data.map((value, i) => (
                  <td key={i} className="border p-2">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handlePredict}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Get Prediction'}
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {prediction && (
        <div className="bg-green-100 p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-semibold mb-4">Prediction Result</h2>
          <ul>
            <li>INFLOW: {prediction[0]}</li>
            <li>OUTFLOW: {prediction[1]}</li>
            <li>TMA: {prediction[2]}</li>
            <li>BEBAN: {prediction[3]}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MachineLearningContent;
