import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, answers, timestamp } = req.body
    
    console.log('Saving answers:', { userId, answers, timestamp })
    
    return res.status(200).json({ success: true, message: 'Answers saved successfully' })
  } catch (error) {
    console.error('Error saving answers:', error)
    return res.status(500).json({ error: 'Failed to save answers' })
  }
}
