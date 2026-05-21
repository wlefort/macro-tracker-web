import Anthropic from '@anthropic-ai/sdk'

function getClient() {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set')
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

async function callClaude(system, messages) {
  const client = getClient()
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system,
    messages,
  })
  return response.content[0].text
}

function parseJsonFromContent(content) {
  const cleaned = content
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found in Claude response')
  return JSON.parse(match[0])
}

export async function estimateMacrosFromText(description) {
  const system = `You are a certified nutritionist. Given a short food description, estimate the calories, protein, carbs, and fat as accurately as possible using typical portion sizes. Return ONLY valid JSON in this format: {"calories": number, "protein": number, "carbs": number, "fat": number}. Do not include any explanation or formatting outside the JSON object.`

  const content = await callClaude(system, [
    { role: 'user', content: description },
  ])
  return parseJsonFromContent(content)
}

export async function estimateMacrosFromImage(base64Data, mediaType, description) {
  const system = `You are a certified nutritionist. Given a food photo, estimate the calories, protein, carbs, and fat as accurately as possible using typical portion sizes. Return ONLY valid JSON: {"calories": number, "protein": number, "carbs": number, "fat": number}`

  const userContent = [
    {
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: base64Data },
    },
    { type: 'text', text: description || 'Estimate the macros for this food.' },
  ]

  const content = await callClaude(system, [{ role: 'user', content: userContent }])
  return parseJsonFromContent(content)
}

export async function estimateExerciseCalories(description, userInfo) {
  const { age, weight, height } = userInfo

  const system = `You are a fitness expert that estimates calories burned from exercise.`

  const prompt = `You are a fitness expert estimating calories burned from exercise using the MET formula:
Calories Burned = (MET × Weight in kg × 3.5) / 200 × duration in minutes.
Use standard MET values for each activity and be generous but realistic for moderate to intense efforts.

Exercise Description: "${description}"
User Info: Age ${age}, Weight ${weight} lbs, Height ${height} in.

Return ONLY the number of calories burned as a plain number, with no extra words or formatting.`

  const content = await callClaude(system, [{ role: 'user', content: prompt }])
  return content.trim()
}

export async function calculateRecommendedMacros(userInfo) {
  const { age, weight, height, activityLevel, goalType, targetRatePerWeek } = userInfo

  const system = `You are a certified fitness and nutrition expert. You give precise and varied macronutrient recommendations based on detailed user data, strictly tailored to their fitness goals and activity level. Do not reuse generic macro estimates. Always calculate unique numbers based on each input.`

  const timestamp = Date.now()
  const prompt = `Summary: ${age} years old, ${weight} lbs, ${height} inches tall, activity level: ${activityLevel}, goal: ${goalType} ${targetRatePerWeek} lbs/week.

Client Details:
- Age: ${age}
- Weight: ${weight} lbs
- Height: ${height} inches
- Goal: ${goalType} ${targetRatePerWeek} lb/week
- Activity Level: ${activityLevel}
- Timestamp: ${timestamp}

Instructions:
1. Use the **Mifflin-St Jeor** equation to calculate BMR:
   - BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5 (for males)
2. Convert weight/height to metric units:
   - 1 lb = 0.453592 kg; 1 inch = 2.54 cm
3. Adjust BMR using the following activity multipliers to get TDEE:
   - Sedentary: 1.2
   - Light: 1.375
   - Moderate: 1.55
   - Active: 1.725
   - Very Active: 1.9
   - Extra Active: 2.0
4. For weight loss, subtract 500 kcal/day per pound/week from TDEE
5. Macronutrients:
   - Protein: **0.75g per lb of current body weight**
   - Fat: 25–30% of total calories
   - Carbs: fill the remainder
6. Do **not** reuse estimates from earlier responses. All macro outputs must reflect this specific input.
7. Never round down total calories excessively. Maintain accuracy unless above 4500 kcal/day.

Respond ONLY with the following JSON block. No commentary, no explanations. Wrap it in triple backticks:
\`\`\`
{"calories": ..., "protein": ..., "carbs": ..., "fat": ...}
\`\`\``

  const content = await callClaude(system, [{ role: 'user', content: prompt }])
  return parseJsonFromContent(content)
}
