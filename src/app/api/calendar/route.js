import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET() {
  try {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      // Return mock data if Notion is not configured
      const mockEvents = [
        {
          id: '1',
          title: 'Live Music Night',
          date: '2025-10-10',
          time: '7:00 PM',
          description: 'Join us for an evening of live local music!',
          type: 'music'
        },
        {
          id: '2',
          title: 'Trivia Night',
          date: '2025-10-12',
          time: '8:00 PM',
          description: 'Test your knowledge and win prizes!',
          type: 'event'
        },
        {
          id: '3',
          title: 'Wine Tasting Event',
          date: '2025-10-15',
          time: '6:00 PM',
          description: 'Sample our finest wine selection.',
          type: 'event'
        },
        {
          id: '4',
          title: 'Acoustic Session',
          date: '2025-10-18',
          time: '7:30 PM',
          description: 'Relax with acoustic performances by local artists.',
          type: 'music'
        },
        {
          id: '5',
          title: 'Halloween Party',
          date: '2025-10-31',
          time: '8:00 PM',
          description: 'Join us for our annual Halloween celebration!',
          type: 'event'
        }
      ];

      return new Response(JSON.stringify({ events: mockEvents }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const databaseId = process.env.NOTION_DATABASE_ID;
    
    // Query the Notion database for calendar events
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Date',
        date: {
          is_not_empty: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'ascending',
        },
      ],
    });

    // Transform Notion data to calendar events
    const events = response.results.map((page) => {
      const properties = page.properties;
      
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled Event',
        date: properties.Date?.date?.start || '',
        time: properties.Time?.rich_text?.[0]?.plain_text || '',
        description: properties.Description?.rich_text?.[0]?.plain_text || '',
        type: properties.Type?.select?.name || 'event',
      };
    });

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching calendar data:', error);
    
    // Return mock data on error
    const mockEvents = [
      {
        id: '1',
        title: 'Live Music Night',
        date: '2025-10-10',
        time: '7:00 PM',
        description: 'Join us for an evening of live local music!',
        type: 'music'
      },
      {
        id: '2',
        title: 'Trivia Night',
        date: '2025-10-12',
        time: '8:00 PM',
        description: 'Test your knowledge and win prizes!',
        type: 'event'
      }
    ];

    return new Response(JSON.stringify({ events: mockEvents }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}