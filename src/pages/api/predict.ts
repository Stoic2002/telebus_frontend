import * as tf from '@tensorflow/tfjs'; // Gunakan tfjs-node untuk server-side
import { NextApiRequest, NextApiResponse } from 'next';

let model: tf.LayersModel | null = null;

// Fungsi untuk memuat model
const loadModel = async () => {
  if (!model) {
    model = await tf.loadLayersModel('http://localhost:3000/model/model.json'); // Pastikan path sesuai
  }
  return model;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { inputData } = req.body;

      if (!inputData || !Array.isArray(inputData)) {
        return res.status(400).json({ error: 'Input data harus berupa array' });
      }

      // Muat model
      const model = await loadModel();

      // Konversi input data ke tensor dengan bentuk yang benar
      const inputTensor = tf.tensor3d(inputData, [inputData.length, inputData[0].length, inputData[0][0].length]);

      // Prediksi
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const predictionData = await prediction.array(); // Ambil data hasil prediksi

      return res.status(200).json({ prediction: predictionData });
    } catch (error) {
      console.error('Error during prediction:', error);
      return res.status(500).json({ error: 'Gagal melakukan prediksi' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
