/**
 * KrishiAI Chat Service
 * Simulates an NLP-powered backend for intent detection and response generation.
 */

/**
 * Core logic: getBotReply(message)
 * Enhanced matching for agriculture topics.
 */
export function getBotReply(message) {
  const query = message.toLowerCase();

  // Soil & Crops logic
  if (query.includes("black soil") || query.includes("cotton")) {
    return "Black soil has high moisture retention. Best crops to grow are Cotton, Soybean, and Turmeric 🌱";
  }
  if (query.includes("red soil") || query.includes("groundnut")) {
    return "Red soil drains well. It is highly suitable for Groundnut, Millets, and Red Gram 🌾";
  }
  if (query.includes("crop") || query.includes("best crop")) {
    return "To suggest the best crop, could you tell me your soil type (e.g., black, red, clay) and the current season?";
  }

  // Pesticide & Disease logic
  if (query.includes("pest") || query.includes("disease") || query.includes("blight") || query.includes("tomato")) {
    return "For common pests and blights, neem oil is a great organic start. For severe cases, use Copper Oxychloride spray 🐛. Always test on a small area first!";
  }
  if (query.includes("fertilizer") || query.includes("npk") || query.includes("rice")) {
    return "For optimal rice growth, apply NPK (Nitrogen, Phosphorus, Potassium) in a 120:60:40 kg/ha ratio. Add Zinc if the soil is deficient.";
  }

  // Irrigation logic
  if (query.includes("water") || query.includes("irrigation") || query.includes("dry")) {
    return "Drip irrigation is highly efficient for water conservation. Make sure your soil feels moist but not waterlogged to prevent root rot 💧";
  }

  // Weather logic
  if (query.includes("weather") || query.includes("rain") || query.includes("monsoon")) {
    return "Based on recent forecasts, expect light to moderate rainfall over the next 3-4 days. Good time to hold off on heavy irrigation 🌦";
  }

  // Profit / Market logic
  if (query.includes("price") || query.includes("market") || query.includes("profit")) {
    return "Current market trends are favorable for pulses and exotic vegetables. Rice is averaging ₹2200/quintal and Wheat ₹1800/quintal. Check the Dashboard for real-time prices 💰";
  }
  if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("namaste")) {
    return "Namaste! 🙏 How can I assist with your farming today? Ask me about crops, soil, pests, or market prices.";
  }

  // Fallback
  return "I'm not quite sure about that. Could you try asking about crops, soil types, pests, or market prices?";
}

/**
 * Simulates an API call to a backend AI service.
 */
export async function sendMessageToAI(message) {
  // Simple realistic typing delay (1.5s for a more "thinking" feel)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const responseText = getBotReply(message);
  
  return {
    text: responseText,
    timestamp: new Date().toISOString(),
    status: 'success'
  };
}
