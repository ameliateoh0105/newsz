interface PipedreamResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export class PipedreamService {
  private static readonly WEBHOOK_URL = 'https://eo19k75419koo7s.m.pipedream.net';

  static async triggerWebSearch(query: string): Promise<PipedreamResponse> {
    try {
      console.log('Triggering Pipedream webhook with query:', query);
      
      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Web search triggered!',
          query: query,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Pipedream request failed: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Pipedream response:', data);

      return {
        success: true,
        message: 'Webhook triggered successfully',
        data: data
      };
    } catch (error) {
      console.error('Pipedream webhook error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}