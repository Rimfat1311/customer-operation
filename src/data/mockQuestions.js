export const INITIAL_QUESTIONS = [
  {
    id: 'Q-9812',
    customer: 'Acme Corporation Ltd',
    sender: 'Sarah Jenkins',
    subject: 'Delayed shipment of product batch B-402',
    body: 'Hello Support, we ordered 150 units of the smart controller hub under SAP Sold To ID 470011. The delivery was scheduled for yesterday, but the carrier tracker is showing no updates since it departed the hub. Can you please check on this?',
    time: '12 mins ago',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'Q-9809',
    customer: 'Global Tech Solutions',
    sender: 'David Chen',
    subject: 'API integration endpoint error (500 Internal Server)',
    body: 'When trying to sync our inventory records through the customer webhook endpoint, we are consistently receiving a 500 error response. The payload matches the schema in the dev portal. Is there an active incident?',
    time: '45 mins ago',
    priority: 'critical',
    status: 'pending'
  },
  {
    id: 'Q-9788',
    customer: 'Summit Retailers',
    sender: 'Emma Rodriguez',
    subject: 'Credit hold inquiry',
    body: 'We noticed our portal accounts are marked suspended. We processed the outstanding payment of $98,750 on Friday afternoon. Could you please review and remove the hold on our account?',
    time: '2 hours ago',
    priority: 'medium',
    status: 'pending'
  }
];
