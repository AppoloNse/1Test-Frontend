import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, answers, violations, completed, timestamp } = req.body
    
    console.log('Finalizing test:', { userId, completed, violations, timestamp })
    
    return res.status(200).json({ 
      success: true, 
      message: 'Test finalized successfully',
    })
  } catch (error) {
    console.error('Error finalizing test:', error)
    return res.status(500).json({ error: 'Failed to finalize test' })
  }
}
