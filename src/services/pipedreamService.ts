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
          searchQuery: query,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Pipedream request failed: ${response.status} - ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Pipedream raw response:', responseText);
      
      // Try to parse as JSON, but fall back to text if it fails
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        // If it's not JSON, treat the text response as the data
        data = { message: responseText };
      }
      
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