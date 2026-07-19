const axios = require('axios');

/**
 * Triggers an outgoing webhook for a business.
 * @param {object} business - The business object containing settings.
 * @param {string} event - The event name (e.g., 'order.new', 'message.new').
 * @param {object} data - The payload to send.
 */
async function triggerWebhook(business, event, data) {
    try {
        const webhookUrl = business.settings?.webhook_url;
        if (!webhookUrl) return;

        console.log(`[Webhook] Triggering ${event} for biz ${business.id} to ${webhookUrl}`);
        
        await axios.post(webhookUrl, {
            event,
            business_id: business.id,
            business_name: business.name,
            timestamp: new Date().toISOString(),
            data
        }, {
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error(`[Webhook Error] Failed to trigger ${event} for biz ${business?.id}:`, err.message);
    }
}

module.exports = { triggerWebhook };
