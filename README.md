# MiN NEW YORK CEO Dashboard

A comprehensive executive dashboard for MiN NEW YORK luxury fragrance brand, featuring real-time KPIs, voice commands via Grok AI, and detailed analytics for sales, inventory, and social media performance.

## Features

- **Real-time KPI Monitoring**: Track critical business metrics at a glance
- **Voice Command Integration**: Use Grok AI to query data and trigger actions by voice
- **Sales Analytics**: Analyze revenue trends, top products, and channel performance
- **Inventory Management**: Monitor stock levels across multiple warehouses (Las Vegas, Nice, Dubai, Riyadh)
- **Social Media Metrics**: Track performance across Instagram and TikTok platforms
- **Luxury UI Design**: Premium aesthetic matching the MiN NEW YORK brand identity

## Technical Stack

- **Frontend**: React.js with Context API for state management
- **Charts & Visualization**: Chart.js with React-Chartjs-2
- **Styling**: Custom CSS with responsive design
- **API Integration**:
  - WooCommerce REST API via n8n workflows
  - Grok xAI API for voice commands and AI analysis
  - Social media APIs (Instagram, TikTok)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- WooCommerce store with REST API access
- Grok subscription (X Premium+ or SuperGrok)
- Instagram & TikTok business accounts (for production use)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/min-ceo-dashboard.git
   cd min-ceo-dashboard
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:

   ```
   REACT_APP_WOOCOMMERCE_URL=your_woocommerce_url
   REACT_APP_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
   REACT_APP_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
   REACT_APP_GROK_API_KEY=your_grok_api_key
   REACT_APP_INSTAGRAM_API_KEY=your_instagram_api_key
   REACT_APP_TIKTOK_API_KEY=your_tiktok_api_key
   REACT_APP_N8N_BASE_URL=your_n8n_instance_url
   REACT_APP_N8N_API_KEY=your_n8n_api_key
   ```

4. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
min-ceo-dashboard/
│
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo.png
│   └── manifest.json
│
├── src/
│   ├── api/
│   │   ├── grok.js           # Grok API integration
│   │   ├── n8n.js            # n8n workflow integration
│   │   ├── socialMedia.js    # Social media API integration
│   │   └── woocommerce.js    # WooCommerce API integration
│   │
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   ├── GrokVoiceCommandPanel.js
│   │   ├── Header.js
│   │   ├── InventoryStatus.js
│   │   ├── MarketTrends.js
│   │   ├── SalesOverview.js
│   │   ├── Sidebar.js
│   │   └── SocialMediaMetrics.js
│   │
│   ├── contexts/
│   │   ├── AuthContext.js    # Authentication provider
│   │   ├── DataContext.js    # Data provider
│   │   └── ThemeContext.js   # Theme provider
│   │
│   ├── styles/               # Component styles
│   │
│   ├── App.js
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Grok Voice Commands

The dashboard supports the following voice commands via Grok AI:

- "Summarize today's sales performance"
- "Show inventory levels in [warehouse name]"
- "What's our Instagram engagement this week?"
- "Schedule a reminder for [event]"
- "Compare our performance with [competitor]"

## Integration Setup

### WooCommerce Integration

1. Create API keys in your WooCommerce store:
   - Go to WooCommerce > Settings > Advanced > REST API
   - Add a new key with Read/Write permissions
   - Copy the Consumer Key and Consumer Secret to your `.env` file

### Grok Integration

1. Subscribe to X Premium+ or SuperGrok
2. Set up your Grok API access through your account
3. Copy your API key to the `.env` file

### n8n Setup

1. Install n8n locally or use a hosted instance
2. Import the workflow templates from the `n8n-workflows` directory
3. Configure the workflow credentials for WooCommerce, social media, etc.
4. Update the n8n base URL and API key in your `.env` file

## Customization

### Theme Customization

The dashboard supports multiple themes including Light, Dark, and Luxury modes. Theme settings are managed via the ThemeContext provider.

To customize the color scheme:

1. Edit the theme variables in `src/contexts/ThemeContext.js`
2. Update the CSS variables in `src/styles/App.css`

### Adding New Dashboards

To add a new dashboard section:

1. Create a new component in the `components` directory
2. Add the corresponding styles in the `styles` directory
3. Update the routes in `App.js`
4. Add the navigation link in `Sidebar.js`

## Production Deployment

For production deployment:

1. Build the optimized application:

   ```
   npm run build
   ```

2. Deploy the contents of the `build` directory to your web server or hosting service

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chart.js for the visualization components
- React-Icons for the icon library
- n8n for the workflow automation
- Grok xAI for the voice command capabilities
