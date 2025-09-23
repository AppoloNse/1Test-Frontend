import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const violationData = req.body
    
    console.log('Recording violation:', violationData)
    
    return res.status(200).json({ success: true, message: 'Violation recorded' })
  } catch (error) {
    console.error('Error recording violation:', error)
    return res.status(500).json({ error: 'Failed to record violation' })
  }
}
